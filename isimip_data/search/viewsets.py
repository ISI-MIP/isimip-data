from django.conf import settings
from django.db.models import Count

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from isimip_data.metadata.models import Dataset, File

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

    @action(detail=False, url_path='facets/(?P<attribute>[A-Za-z0-9_]+)')
    def facets(self, request, attribute):
        if attribute not in settings.ATTRIBUTES_FILTER:
            raise NotFound
        else:
            field = 'attributes__%s' % attribute
            queryset = self.filter_queryset(self.get_queryset())
            values = queryset.values_list(field).annotate(count=Count(field)).order_by(field)
            return Response(values)

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
