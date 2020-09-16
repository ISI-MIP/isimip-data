from pathlib import PurePath

from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet

from .filters import (AttributeFilterBackend, PathFilterBackend,
                      SearchFilterBackend, TreeFilterBackend,
                      VersionFilterBackend)
from .models import Attribute, Dataset, File, Tree
from .serializers import DatasetSerializer, FileSerializer
from .utils import fetch_glossary


class Pagination(PageNumberPagination):
    page_size = settings.METADATA_PAGE_SIZE


class DatasetViewSet(ReadOnlyModelViewSet):

    serializer_class = DatasetSerializer
    queryset = Dataset.objects.using('metadata')
    pagination_class = Pagination

    filter_backends = (
        DjangoFilterBackend,
        SearchFilterBackend,
        VersionFilterBackend,
        AttributeFilterBackend,
        PathFilterBackend,
        TreeFilterBackend
    )
    filterset_fields = (
        'name',
    )
    attribute_filter_exclude = None

    @action(detail=False, url_path='histogram/(?P<attribute>[A-Za-z0-9_]+)')
    def histogram(self, request, attribute):
        if Attribute.objects.using('metadata').filter(key=attribute).exists():
            # exclude the attribute from AttributeFilterBackend
            self.attribute_filter_exclude = attribute
            queryset = self.filter_queryset(self.get_queryset())
            values = queryset.histogram(attribute)
            return Response(values)
        else:
            raise NotFound

    @action(detail=False, renderer_classes=[TemplateHTMLRenderer])
    def filelist(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        response = Response({
            'files': File.objects.using('metadata').filter(dataset__in=queryset)
        }, template_name='metadata/filelist.txt', content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=filelist.txt'
        return response

    @action(detail=False, renderer_classes=[TemplateHTMLRenderer])
    def wget(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        response = Response({
            'files': File.objects.using('metadata').filter(dataset__in=queryset)
        }, template_name='metadata/wget.sh', content_type='text/x-shellscript; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=wget.sh'
        return response

    @action(detail=True, url_path='filelist', renderer_classes=[TemplateHTMLRenderer])
    def detail_filelist(self, request, pk):
        dataset = self.get_object()

        response = Response({
            'files': File.objects.using('metadata').filter(dataset=dataset)
        }, template_name='metadata/filelist.txt', content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=%s_v%s.txt' % (dataset.name, dataset.version)
        return response

    @action(detail=True, url_path='wget', renderer_classes=[TemplateHTMLRenderer])
    def detail_wget(self, request, pk):
        dataset = self.get_object()

        response = Response({
            'files': File.objects.using('metadata').filter(dataset=dataset)
        }, template_name='metadata/wget.sh', content_type='text/x-shellscript; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=wget_%s_v%s.sh' % (dataset.name, dataset.version)
        return response


class FileViewSet(ReadOnlyModelViewSet):

    serializer_class = FileSerializer
    queryset = File.objects.using('metadata')
    pagination_class = Pagination

    filter_backends = (
        DjangoFilterBackend,
        SearchFilterBackend,
        AttributeFilterBackend
    )
    filterset_fields = (
        'name',
        'path',
        'version',
        'checksum'
    )


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
                'identifier': row.identifier,
                'specifier': row.specifier,
                'tree': row.specifier
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
                except StopIteration:
                    raise NotFound

                if 'items' not in response_node:
                    placeholder = ', '.join(['%s' for element in current_tree_elements])
                    raw_queryset = Tree.objects.using('metadata').raw('''
                        SELECT
                          id, obj.value->'identifier' as identifier, obj.value->'specifier' as specifier
                        FROM
                          trees,
                          jsonb_extract_path(tree_dict, {}) as parent,
                          jsonb_each(parent->'items')  as obj;
                    '''.format(placeholder), current_tree_elements)

                    response_node['items'] = [{
                        'identifier': row.identifier,
                        'specifier': row.specifier,
                        'tree': (current_tree / row.specifier).as_posix()
                    } for row in raw_queryset]

                current_tree_elements.append('items')
                current_response_list = response_node['items']

        return Response(response_list)


class GlossaryViewSet(ViewSet):

    def list(self, request):
        return Response(fetch_glossary())
