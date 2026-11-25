from collections import defaultdict
from itertools import product
from pathlib import PurePath

from django.conf import settings
from django.contrib.postgres.search import TrigramSimilarity
from django.core.paginator import Paginator as DjangoPaginator
from django.db import ProgrammingError
from django.db.models import Prefetch, Q
from django.utils.functional import cached_property

from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet

from isimip_data.annotations.models import Annotation
from isimip_data.caveats.models import Caveat
from isimip_data.core.response import AttachmentResponse

from .filters import (
    ChecksumFilterBackend,
    DatasetFilterBackend,
    IdentifierFilterBackend,
    IdFilterBackend,
    NameFilterBackend,
    PathFilterBackend,
    SearchFilterBackend,
    TreeFilterBackend,
    VersionFilterBackend,
)
from .models import Dataset, FacetCount, FacetPair, File, Identifier, Resource, Specifier, Tree
from .serializers import (
    DatasetSerializer,
    FileSerializer,
    IdentifierSerializer,
    ResourceIndexSerializer,
    ResourceSerializer,
)
from .utils import fetch_glossary, split_query_string


class IndentedJSONRenderer(JSONRenderer):
    def get_indent(self, *args, **kwargs):
        return 4


class Paginator(DjangoPaginator):
    @cached_property
    def count(self):
        return self.object_list.order_by()[: settings.METADATA_MAX_COUNT + 1].count()


class Pagination(PageNumberPagination):
    page_size = settings.METADATA_PAGE_SIZE
    page_size_query_param = 'page_size'
    max_page_size = settings.METADATA_MAX_PAGE_SIZE

    django_paginator_class = Paginator


class DatasetViewSet(ReadOnlyModelViewSet):
    serializer_class = DatasetSerializer
    pagination_class = Pagination

    filter_backends = (
        IdFilterBackend,
        NameFilterBackend,
        PathFilterBackend,
        SearchFilterBackend,
        VersionFilterBackend,
        IdentifierFilterBackend,
        TreeFilterBackend,
    )

    def get_queryset(self):
        datasets = Dataset.objects.using('metadata')
        files = File.objects.using('metadata')
        resources = Resource.objects.using('metadata')

        return datasets.prefetch_related(
            Prefetch('links', queryset=datasets),
            Prefetch(
                'files',
                queryset=files.prefetch_related(
                    Prefetch('links', queryset=files),
                    Prefetch('datasets', queryset=datasets),
                ),
            ),
            Prefetch('resources', queryset=resources),
        ).filter(target=None)

    def get_serializer_context(self):
        context = super().get_serializer_context()

        if (
            self.action == 'list'
            and self.paginator is not None
            and self.paginator.page is not None
            and self.paginator.page.object_list
        ):
            dataset_ids = [obj.id for obj in self.paginator.page.object_list]
            dataset_paths = [obj.path for obj in self.paginator.page.object_list]

            if self.request.GET.get('caveats'):
                versions = list(
                    Dataset.objects.using('metadata')
                    .filter(path__in=dataset_paths)
                    .exclude(id__in=dataset_ids)
                    .only('id', 'path')
                )

                context['versions'] = defaultdict(set)
                for version in versions:
                    context['versions'][version.path].add(version.id)

                context['caveats'] = list(
                    Caveat.objects.filter(datasets__overlap=dataset_ids).exclude(public=False).public(self.request.user)
                )

                context['caveats_versions'] = list(
                    Caveat.objects.filter(datasets__overlap=[version.id for version in versions])
                    .exclude(public=False)
                    .exclude(id__in=[caveat.id for caveat in context['caveats']])
                    .public(self.request.user)
                )

            if self.request.GET.get('annotations'):
                context['annotations'] = Annotation.objects.filter(datasets__overlap=dataset_ids)

        return context

    @action(detail=False)
    def suggestions(self, request):
        query = request.GET.get('query')
        if query:
            query_strings = split_query_string(query)

            specifiers = []
            for query_string in query_strings:
                query_string_specifiers = (
                    Specifier.objects.using('metadata')
                    .annotate(similarity=TrigramSimilarity('specifier', query_string))
                    .filter(similarity__gt=settings.SEARCH_SIMILARITY)
                    .order_by('-similarity')
                    .values_list('specifier', flat=True)[: settings.SEARCH_SIMILARITY_LIMIT]
                )
                if query_string_specifiers:
                    specifiers.append(query_string_specifiers)

            return Response(
                [
                    ' '.join(permutation)
                    for permutation in list(product(*specifiers))[: settings.METADATA_MAX_SUGGESTIONS]
                ]
            )
        else:
            return Response([])

    # GET parameters that restrict the queryset beyond the identifier specifiers
    # (all other filter backends besides IdentifierFilterBackend); histograms can
    # only be served from the precomputed facet tables if none of them is present
    FAST_HISTOGRAM_EXCLUDED_PARAMS = frozenset({'id', 'name', 'path', 'query', 'all', 'after', 'before', 'tree'})

    def _active_identifier_filters(self, request):
        # returns the active identifier filters (parameter -> non-empty values), or None if any
        # of the other filter parameters is present, since then the precomputed facet tables
        # cannot answer the request
        if set(request.GET.keys()) & self.FAST_HISTOGRAM_EXCLUDED_PARAMS:
            return None

        identifiers = set(Identifier.objects.using('metadata').identifiers())
        return {
            key: [value for value in values if value]
            for key, values in request.GET.lists()
            if key in identifiers and any(values)
        }

    def facet_values(self, values):
        # sort by specifier, in agreement with the histogram endpoint (which yields null values
        # for datasets without the specifier, sorted last), and keep only the most frequent
        # values if there are too many
        limit = settings.METADATA_MAX_FACET_VALUES
        values = sorted(values, key=lambda value: (value[0] is None, value[0] or ''))
        if len(values) > limit:
            values = sorted(sorted(values, key=lambda value: value[1], reverse=True)[:limit])
        return values

    def fast_histogram(self, request, identifier):
        """
        Try to serve the histogram of the given identifier from the precomputed facet
        tables: facet_count if no filter is applied, facet_pair if exactly one identifier
        filter with a single value is applied. The tables match the semantics of the
        regular path (public rows, count of distinct root datasets per specifier value).

        Returns None if the request cannot be served from the tables (in which case the
        caller has to fall back to computing the histogram from the datasets table).
        """
        active_filters = self._active_identifier_filters(request)
        if active_filters is None or len(active_filters) > 1:
            return None

        try:
            if len(active_filters) == 1:
                (filter_identifier, values), = active_filters.items()

                if filter_identifier == identifier:
                    # the filter backend excludes the identifiers of a facet from its own histogram anyway
                    return self.count_histogram(identifier)

                if len(values) != 1:
                    # pairs are per value, multiple values would need re-counting
                    return None

                value = values[0]
                rows = list(
                    FacetPair.objects.using('metadata')
                    .filter(
                        Q(identifier_1=filter_identifier, specifier_1=value, identifier_2=identifier)
                        | Q(identifier_2=filter_identifier, specifier_2=value, identifier_1=identifier)
                    )
                    .values_list('identifier_1', 'specifier_1', 'identifier_2', 'specifier_2', 'count')
                )

                if not rows:
                    # cannot distinguish missing table entries from an empty histogram
                    return None

                return sorted(
                    (specifier_1, count) if identifier_1 == identifier else (specifier_2, count)
                    for identifier_1, specifier_1, identifier_2, specifier_2, count in rows
                )

            return self.count_histogram(identifier)
        except ProgrammingError:
            # the facet tables do not (yet) exist in the metadata database
            return None

    def count_histogram(self, identifier):
        values = list(
            FacetCount.objects.using('metadata')
            .filter(identifier=identifier)
            .order_by('specifier')
            .values_list('specifier', 'count')
        )

        if not values:
            # facet_count has no entries for this identifier, fall back to computing
            return None

        return values

    def computed_histogram(self, request, identifier):
        # exclude the identifier from IdentifierFilterBackend and do not resolve links
        self.filter_exclude_identifier = identifier
        self.filter_resolve_links = False

        queryset = self.filter_queryset(Dataset.objects.using('metadata'))
        return queryset.histogram(identifier)

    def fast_histograms(self, request, identifiers):
        # like fast_histogram, but for all facet identifiers at once, returning a
        # mapping of identifier to its list of [specifier, count] values
        active_filters = self._active_identifier_filters(request)
        if active_filters is None or len(active_filters) > 1:
            return None

        try:
            rows = []
            if len(active_filters) == 0:
                rows = list(
                    FacetCount.objects.using('metadata')
                    .filter(identifier__in=identifiers)
                    .values_list('identifier', 'specifier', 'count')
                )
            else:
                (filter_identifier, values), = active_filters.items()

                if len(values) != 1:
                    # pairs are per value, multiple values would need re-counting
                    return None

                value = values[0]
                for identifier_1, specifier_1, identifier_2, specifier_2, count in (
                    FacetPair.objects.using('metadata')
                    .filter(
                        Q(identifier_1=filter_identifier, specifier_1=value, identifier_2__in=identifiers)
                        | Q(identifier_2=filter_identifier, specifier_2=value, identifier_1__in=identifiers)
                    )
                    .values_list('identifier_1', 'specifier_1', 'identifier_2', 'specifier_2', 'count')
                ):
                    facet_identifier = identifier_2 if identifier_1 == filter_identifier else identifier_1
                    if facet_identifier == filter_identifier:
                        # a facet's own histogram excludes its own filter anyway
                        continue
                    specifier = specifier_1 if facet_identifier == identifier_1 else specifier_2
                    rows.append((facet_identifier, specifier, count))

                # the histogram of the filter identifier itself is the unfiltered one
                rows += list(
                    FacetCount.objects.using('metadata')
                    .filter(identifier=filter_identifier)
                    .values_list('identifier', 'specifier', 'count')
                )

            if not rows:
                # cannot distinguish missing table entries from empty histograms
                return None

            values = {identifier: [] for identifier in identifiers}
            for identifier, specifier, count in rows:
                if identifier in values:
                    values[identifier].append([specifier, count])
            for identifier in values:
                values[identifier] = self.facet_values(values[identifier])
            return values
        except ProgrammingError:
            # the facet tables do not (yet) exist in the metadata database
            return None

    def computed_histograms(self, request, identifiers):
        return {
            identifier: self.facet_values(list(self.computed_histogram(request, identifier)))
            for identifier in identifiers
        }

    @action(detail=False, url_path='histogram/(?P<identifier>[A-Za-z0-9_]+)')
    def histogram(self, request, identifier):
        if Identifier.objects.using('metadata').filter(identifier=identifier).exists():
            values = self.fast_histogram(request, identifier)
            if values is None:
                values = self.computed_histogram(request, identifier)

            return Response(values)
        else:
            raise NotFound

    @action(detail=False, url_path='facets')
    def facets(self, request):
        # all facet histograms for the current filter state in one request
        identifiers = [facet['identifier'] for group in settings.SEARCH_FACETS for facet in group]

        values = self.fast_histograms(request, identifiers)
        if values is None:
            values = self.computed_histograms(request, identifiers)

        return Response(values)

    @action(detail=False, renderer_classes=[TemplateHTMLRenderer])
    def filelist(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        return AttachmentResponse(
            {'files': [file for dataset in queryset.all() for file in dataset.files.all()]},
            template_name='metadata/filelist.txt',
            content_type='text/plain; charset=utf-8',
            file_name='filelist.txt',
        )

    @action(detail=True, url_path='filelist', renderer_classes=[TemplateHTMLRenderer])
    def detail_filelist(self, request, pk):
        dataset = self.get_object()
        return AttachmentResponse(
            {'files': dataset.files.all()},
            template_name='metadata/filelist.txt',
            content_type='text/plain; charset=utf-8',
            file_name=f'{dataset.name}.txt',
        )

    @action(detail=True, url_path='manifest', renderer_classes=[TemplateHTMLRenderer])
    def detail_manifest(self, request, pk):
        dataset = self.get_object()
        return AttachmentResponse(
            {'files': dataset.files.all()},
            template_name='metadata/manifest.txt',
            content_type='text/plain; charset=utf-8',
            file_name=f'{dataset.name}-manifest.txt',
        )


class FileViewSet(ReadOnlyModelViewSet):
    queryset = (
        File.objects.using('metadata')
        .filter(target=None)
        .prefetch_related(
            'datasets',
            'links',
        )
    )

    serializer_class = FileSerializer
    pagination_class = Pagination

    filter_backends = (
        IdFilterBackend,
        DatasetFilterBackend,
        NameFilterBackend,
        PathFilterBackend,
        SearchFilterBackend,
        VersionFilterBackend,
        IdentifierFilterBackend,
        TreeFilterBackend,
        ChecksumFilterBackend,
    )

    # stops the ?dataset= parameter from also being treated as identifier in the IdentifierFilterBackend
    filter_exclude_identifier = 'dataset'


class ResourceViewSet(ReadOnlyModelViewSet):
    queryset = Resource.objects.using('metadata')
    serializer_class = ResourceSerializer
    pagination_class = Pagination

    filter_backends = (IdFilterBackend,)

    @action(detail=False)
    def index(self, request):
        queryset = self.get_queryset()
        serializer = ResourceIndexSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, url_path='datasets', renderer_classes=[IndentedJSONRenderer])
    def detail_datasets(self, request, pk):
        resource = self.get_object()
        base_url = request.build_absolute_uri()
        datasets = Dataset.objects.using('metadata').filter(resources=resource)
        return AttachmentResponse(
            [
                {
                    'id': dataset.id,
                    'path': dataset.path,
                    'version': dataset.version,
                    'public': dataset.public,
                    'metadata_url': base_url + dataset.get_absolute_url(),
                }
                for dataset in datasets
            ],
            file_name=f'{resource.doi}.datasets.json',
        )

    @action(detail=True, url_path='files', renderer_classes=[IndentedJSONRenderer])
    def detail_files(self, request, pk):
        resource = self.get_object()
        base_url = request.build_absolute_uri()
        files = (
            File.objects.using('metadata').prefetch_related('datasets').filter(datasets__resources=resource).distinct()
        )
        return AttachmentResponse(
            [
                {
                    'id': file.id,
                    'path': file.path,
                    'version': file.version,
                    'public': file.public,
                    'checksum': file.checksum,
                    'checksum_type': file.checksum_type,
                    'metadata_url': base_url + file.get_absolute_url(),
                    'file_url': file.file_url,
                    'json_url': file.json_url,
                }
                for file in files
            ],
            file_name=f'{resource.doi}.files.json',
        )

    @action(detail=True, url_path='filelist', renderer_classes=[TemplateHTMLRenderer])
    def detail_filelist(self, request, pk):
        resource = self.get_object()
        files = (
            File.objects.using('metadata').prefetch_related('datasets').filter(datasets__resources=resource).distinct()
        )
        return AttachmentResponse(
            {'files': files},
            template_name='metadata/filelist.txt',
            content_type='text/plain; charset=utf-8',
            file_name=f'{resource.doi}.txt',
        )

    @action(detail=True, url_path='manifest', renderer_classes=[TemplateHTMLRenderer])
    def detail_manifest(self, request, pk):
        resource = self.get_object()
        files = File.objects.using('metadata').filter(datasets__resources=resource).distinct()
        return AttachmentResponse(
            {'files': files},
            template_name='metadata/manifest.txt',
            content_type='text/plain; charset=utf-8',
            file_name=f'{resource.doi}-manifest.txt',
        )


class TreeViewSet(ViewSet):
    def list(self, request):
        raw_queryset = Tree.objects.using('metadata').raw("""
            SELECT
              id, obj.value->'identifier' as identifier, obj.value->'specifier' as specifier
            FROM
              trees,
              jsonb_each(tree_dict) as obj;
        """)

        response_list = [
            {
                'identifier': row.identifier.strip('"'),
                'specifier': row.specifier.strip('"'),
                'tree': row.specifier.strip('"'),
            }
            for row in raw_queryset
        ]

        # loop over path list arguments
        tree_list = [PurePath(tree) for tree in request.GET.getlist('tree', [])]
        for tree in tree_list:
            current_tree = PurePath()
            current_tree_elements = []
            current_response_list = response_list

            for specifier in tree.parts:
                current_tree /= specifier
                current_tree_elements.append(specifier)

                try:
                    response_node = next(item for item in current_response_list if item.get('specifier') == specifier)
                except StopIteration as e:
                    raise NotFound from e

                if 'items' not in response_node:
                    placeholder = ', '.join(['%s' for element in current_tree_elements])
                    raw_queryset = Tree.objects.using('metadata').raw(
                        f"""
                        SELECT
                          id, obj.value->'identifier' as identifier, obj.value->'specifier' as specifier
                        FROM
                          trees,
                          jsonb_extract_path(tree_dict, {placeholder}) as parent,
                          jsonb_each(parent->'items')  as obj;
                    """,
                        current_tree_elements,
                    )

                    response_node['items'] = [
                        {
                            'identifier': row.identifier.strip('"'),
                            'specifier': row.specifier.strip('"'),
                            'tree': (current_tree / row.specifier.strip('"')).as_posix(),
                        }
                        for row in raw_queryset
                    ]

                current_tree_elements.append('items')
                current_response_list = response_node['items']

        return Response(response_list)


class IdentifierViewSet(ReadOnlyModelViewSet):
    queryset = Identifier.objects.using('metadata')
    serializer_class = IdentifierSerializer


class GlossaryViewSet(ViewSet):
    def list(self, request):
        return Response(fetch_glossary())


class IdViewSet(ViewSet):
    def create(self, request):
        field = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)
        data = field.run_validation(request.data)

        response = [
            *Dataset.objects.using('metadata').filter(id__in=data).values('id', 'path'),
            *File.objects.using('metadata').filter(id__in=data).values('id', 'path'),
            *Resource.objects.using('metadata').filter(id__in=data).values('id', 'doi'),
        ]
        return Response(response)


class ChecksumViewSet(ViewSet):
    def create(self, request):
        field = serializers.ListField(child=serializers.CharField(), allow_empty=False)
        data = field.run_validation(request.data)

        response = File.objects.using('metadata').filter(checksum__in=data).values('checksum', 'path')
        return Response(response)
