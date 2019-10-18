from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.renderers import StaticHTMLRenderer, TemplateHTMLRenderer
from rest_framework.exceptions import NotFound

from .models import Dataset, File, Attribute
from .serializers import DatasetSerializer, FileSerializer
from .filters import SearchFilterBackend, AttributeFilterBackend


class Pagination(PageNumberPagination):
    page_size = 10


class DatasetViewSet(ReadOnlyModelViewSet):

    serializer_class = DatasetSerializer
    queryset = Dataset.objects.using('metadata')
    pagination_class = Pagination

    filter_backends = (
        DjangoFilterBackend,
        SearchFilterBackend,
        AttributeFilterBackend
    )
    filterset_fields = (
        'name',
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

    @action(detail=True, renderer_classes=[StaticHTMLRenderer])
    def filelist(self, request, pk):
        dataset = self.get_object()

        response = Response(dataset.filelist, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=%s_v%s.txt' % (dataset.name, dataset.version)
        return response

    @action(detail=True, renderer_classes=[TemplateHTMLRenderer])
    def wget(self, request, pk):
        dataset = self.get_object()

        response = Response({
            'dataset': dataset
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
        'version',
        'checksum'
    )
