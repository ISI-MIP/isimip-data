from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.pagination import PageNumberPagination

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
        'version',
        'checksum'
    )


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
