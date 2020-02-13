from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet

from .filters import (AttributeFilterBackend, SearchFilterBackend,
                      VersionFilterBackend)
from .models import Attribute, Dataset, File
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
        AttributeFilterBackend
    )
    filterset_fields = (
        'name',
        'path',
        'version'
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
        }, template_name='search/filelist.txt', content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=filelist.txt'
        return response

    @action(detail=False, renderer_classes=[TemplateHTMLRenderer])
    def wget(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        response = Response({
            'files': File.objects.using('metadata').filter(dataset__in=queryset)
        }, template_name='search/wget.sh', content_type='text/x-shellscript; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=wget.sh'
        return response

    @action(detail=True, url_path='filelist', renderer_classes=[TemplateHTMLRenderer])
    def detail_filelist(self, request, pk):
        dataset = self.get_object()

        response = Response({
            'files': File.objects.using('metadata').filter(dataset=dataset)
        }, template_name='search/filelist.txt', content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=%s_v%s.txt' % (dataset.name, dataset.version)
        return response

    @action(detail=True, url_path='wget', renderer_classes=[TemplateHTMLRenderer])
    def detail_wget(self, request, pk):
        dataset = self.get_object()

        response = Response({
            'files': File.objects.using('metadata').filter(dataset=dataset)
        }, template_name='search/wget.sh', content_type='text/x-shellscript; charset=utf-8')
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


class GlossaryViewSet(ViewSet):

    def list(self, request):
        return Response(fetch_glossary())
