from django.conf import settings

from rest_framework.viewsets import ReadOnlyModelViewSet

from .serializers import FacetSerializer


class FacetViewSet(ReadOnlyModelViewSet):

    serializer_class = FacetSerializer
    queryset = settings.SEARCH_FACETS
