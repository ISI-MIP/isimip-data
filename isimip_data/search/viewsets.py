from django.contrib.postgres.search import SearchVector
from django.contrib.postgres.search import SearchQuery
from django.contrib.postgres.search import SearchRank

from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response

from isimip_data.metadata.models import Dataset

from .serializers import DatasetSerializer


class DatasetViewSet(GenericViewSet):

    serializer_class = DatasetSerializer
    queryset = Dataset.objects.using('metadata')

    def list(self, request, *args, **kwargs):

        search_term = request.GET.get('search', '')
        search_query = SearchQuery(search_term)
        search_rank = SearchRank('search_vector', search_query)

        queryset = self.get_queryset().filter(
            search_vector=search_query
        ).annotate(
            rank=search_rank
        ).order_by('-rank')

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
