from itertools import product
from pathlib import PurePath

from django.conf import settings
from django.contrib.postgres.search import TrigramSimilarity

from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet

from isimip_data.core.utils import get_file_base_url

from .filters import (
    IdentifierFilterBackend,
    IdFilterBackend,
    NameFilterBackend,
    PathFilterBackend,
    SearchFilterBackend,
    TreeFilterBackend,
    VersionFilterBackend,
)
from .models import Dataset, File, Identifier, Resource, Specifier, Tree
from .serializers import (
    DatasetSerializer,
    FileSerializer,
    IdentifierSerializer,
    ResourceIndexSerializer,
    ResourceSerializer,
)
from .utils import fetch_glossary, split_query_string


class Pagination(PageNumberPagination):
    page_size = settings.METADATA_PAGE_SIZE
    page_size_query_param = 'page_size'
    max_page_size = settings.METADATA_MAX_PAGE_SIZE


class DatasetViewSet(ReadOnlyModelViewSet):

    serializer_class = DatasetSerializer
    queryset = Dataset.objects.using('metadata').filter(target=None).prefetch_related(
        'files',
        'files__links',
        'links',
        'resources'
    ).distinct('path', 'version')
    pagination_class = Pagination

    filter_backends = (
        IdFilterBackend,
        NameFilterBackend,
        PathFilterBackend,
        SearchFilterBackend,
        VersionFilterBackend,
        IdentifierFilterBackend,
        TreeFilterBackend
    )
    identifier_filter_exclude = None

    @action(detail=False)
    def suggestions(self, request):
        query = request.GET.get('query')
        if query:
            query_strings = split_query_string(query)

            specifiers = []
            for query_string in query_strings:
                query_string_specifiers = \
                    Specifier.objects.using('metadata') \
                                     .annotate(similarity=TrigramSimilarity('specifier', query_string)) \
                                     .filter(similarity__gt=settings.SEARCH_SIMILARITY) \
                                     .order_by('-similarity') \
                                     .values_list('specifier', flat=True)[:settings.SEARCH_SIMILARITY_LIMIT]
                if query_string_specifiers:
                    specifiers.append(query_string_specifiers)

            return Response([
                ' '.join(permutation)
                for permutation in list(product(*specifiers))
            ])
        else:
            return Response([])

    @action(detail=False, url_path='histogram/(?P<identifier>[A-Za-z0-9_]+)')
    def histogram(self, request, identifier):
        if Identifier.objects.using('metadata').filter(identifier=identifier).exists():
            # exclude the identifier from IdentifierFilterBackend
            self.identifier_filter_exclude = identifier
            queryset = self.filter_queryset(Dataset.objects.using('metadata'))
            values = queryset.histogram(identifier)
            return Response(values)
        else:
            raise NotFound

    @action(detail=False, renderer_classes=[TemplateHTMLRenderer])
    def filelist(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        response = Response({
            'file_base_url': get_file_base_url(request),
            'files': File.objects.using('metadata').filter(dataset__in=queryset)
        }, template_name='metadata/filelist.txt', content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=filelist.txt'
        return response

    @action(detail=True, url_path='filelist', renderer_classes=[TemplateHTMLRenderer])
    def detail_filelist(self, request, pk):
        dataset = self.get_object()

        response = Response({
            'file_base_url': get_file_base_url(request),
            'files': File.objects.using('metadata').filter(dataset=dataset)
        }, template_name='metadata/filelist.txt', content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=%s.txt' % dataset.name
        return response


class FileViewSet(ReadOnlyModelViewSet):

    serializer_class = FileSerializer
    queryset = File.objects.using('metadata').filter(target=None).select_related('dataset') \
                           .prefetch_related('links').distinct('path', 'version')
    pagination_class = Pagination

    filter_backends = (
        IdFilterBackend,
        NameFilterBackend,
        PathFilterBackend,
        SearchFilterBackend,
        VersionFilterBackend,
        IdentifierFilterBackend,
        TreeFilterBackend
    )
    filterset_fields = (
        'name',
        'path',
        'version',
        'checksum'
    )


class ResourceViewSet(ReadOnlyModelViewSet):

    serializer_class = ResourceSerializer
    queryset = Resource.objects.using('metadata')
    pagination_class = Pagination

    filter_backends = (
        IdFilterBackend,
        PathFilterBackend,
        SearchFilterBackend
    )

    @action(detail=False)
    def index(self, request):
        queryset = self.get_queryset()
        serializer = ResourceIndexSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, url_path='datasets', renderer_classes=[JSONRenderer])
    def detail_datasets(self, request, pk):
        resource = self.get_object()
        metadata_url_template = request.build_absolute_uri('/datasets/') + '{}/'
        datasets = [
            dict(**dataset, metadata_url=metadata_url_template.format(dataset['id']))
            for dataset in Dataset.objects.using('metadata').filter(resources=resource)
                                                            .values('id', 'path', 'version', 'public')
        ]

        response = Response(datasets)
        response['Content-Disposition'] = 'attachment; filename=%s.datasets.json' % resource.doi
        return response

    @action(detail=True, url_path='files', renderer_classes=[JSONRenderer])
    def detail_files(self, request, pk):
        resource = self.get_object()
        metadata_url_template = request.build_absolute_uri('/files/') + '{}/'
        file_url_template = get_file_base_url(request)
        datasets = [
            dict(
                **file,
                metadata_url=metadata_url_template.format(file['id']),
                file_url=file_url_template + file['path']
            )
            for file in File.objects.using('metadata').filter(dataset__resources=resource)
                                                      .values('id', 'dataset_id', 'path', 'version')
        ]

        response = Response(datasets)
        response['Content-Disposition'] = 'attachment; filename=%s.files.json' % resource.doi
        return response

    @action(detail=True, url_path='filelist', renderer_classes=[TemplateHTMLRenderer])
    def detail_filelist(self, request, pk):
        resource = self.get_object()

        response = Response({
            'file_base_url': get_file_base_url(request),
            'files': File.objects.using('metadata').filter(dataset__resources=resource)
        }, template_name='metadata/filelist.txt', content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=%s.txt' % resource.doi
        return response


class TreeViewSet(ViewSet):

    def list(self, request):
        raw_queryset = Tree.objects.using('metadata').raw('''
            SELECT
              id, obj.value->'identifier' as identifier, obj.value->'specifier' as specifier
            FROM
              trees,
              jsonb_each(tree_dict) as obj;
        ''')

        response_list = [{
                'identifier': row.identifier.strip('"'),
                'specifier': row.specifier.strip('"'),
                'tree': row.specifier.strip('"')
        } for row in raw_queryset]

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
                    raw_queryset = Tree.objects.using('metadata').raw(f'''
                        SELECT
                          id, obj.value->'identifier' as identifier, obj.value->'specifier' as specifier
                        FROM
                          trees,
                          jsonb_extract_path(tree_dict, {placeholder}) as parent,
                          jsonb_each(parent->'items')  as obj;
                    ''', current_tree_elements)

                    response_node['items'] = [{
                        'identifier': row.identifier.strip('"'),
                        'specifier': row.specifier.strip('"'),
                        'tree': (current_tree / row.specifier.strip('"')).as_posix()
                    } for row in raw_queryset]

                current_tree_elements.append('items')
                current_response_list = response_node['items']

        return Response(response_list)


class IdentifierViewSet(ReadOnlyModelViewSet):

    serializer_class = IdentifierSerializer
    queryset = Identifier.objects.using('metadata')


class GlossaryViewSet(ViewSet):

    def list(self, request):
        return Response(fetch_glossary())
