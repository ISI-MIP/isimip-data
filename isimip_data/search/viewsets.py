from django.db.models import Count

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.renderers import StaticHTMLRenderer, TemplateHTMLRenderer

from isimip_data.metadata.models import Dataset, File

from .models import Facet
from .serializers import DatasetSerializer, FileSerializer, FacetSerializer
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

    @action(detail=False, url_path='facets/(?P<attribute>[A-Za-z0-9_]+)')
    def facets(self, request, attribute):
        if not Facet.objects.filter(attribute=attribute).exists():
            raise NotFound
        else:
            field = 'attributes__%s' % attribute
            # exclude the attribute from AttributeFilterBackend
            self.attribute_filter_exclude = attribute
            queryset = self.filter_queryset(self.get_queryset())
            values = queryset.values_list(field).annotate(count=Count(field)).order_by(field)
            return Response(values)

    @action(detail=True, renderer_classes=[StaticHTMLRenderer])
    def filelist(self, request, pk):
        dataset = self.get_object()

        response = Response(dataset.filelist, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=%s_%s.txt' % (dataset.name, dataset.version)
        return response

    @action(detail=True, renderer_classes=[TemplateHTMLRenderer])
    def wget(self, request, pk):
        dataset = self.get_object()

        response = Response({
            'dataset': dataset
        }, template_name='search/wget.sh', content_type='text/x-shellscript; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename=wget_%s_%s.sh' % (dataset.name, dataset.version)
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


class FacetViewSet(ReadOnlyModelViewSet):

    serializer_class = FacetSerializer
    queryset = Facet.objects.all()
