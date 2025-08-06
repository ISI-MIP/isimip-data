from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import AccessSerializer
from .utils import parse_cookies


class AccessViewSet(ListModelMixin, GenericViewSet):

    serializer_class = AccessSerializer

    def get_queryset(self):
        return parse_cookies(self.request)
