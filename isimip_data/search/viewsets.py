from django.conf import settings

from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import FacetSerializer


class FacetViewSet(ListModelMixin, GenericViewSet):

    serializer_class = FacetSerializer
    queryset = settings.SEARCH_FACETS
