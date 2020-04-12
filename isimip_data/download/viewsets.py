from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from .constants import COUNTRIES
from .serializers import CountrySerializer


class CountryViewSet(ListModelMixin, GenericViewSet):

    serializer_class = CountrySerializer
    queryset = COUNTRIES
