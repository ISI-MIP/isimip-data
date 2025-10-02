from django.conf import settings

from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import SettingsSerializer
from .utils import get_download_operations


class SettingsViewSet(ListModelMixin, GenericViewSet):

    serializer_class = SettingsSerializer

    def get_queryset(self):
        return [
            {
                'key': 'DOWNLOAD_OPERATIONS',
                'value': get_download_operations(self.request),
            }
        ] + [
            {
                'key': key,
                'value': getattr(settings, key)
            } for key in [
                'FILES_BASE_URL',
                'FILES_API_URL',
                'METADATA_PAGE_SIZE',
                'METADATA_MAX_COUNT',
                'DOWNLOAD_OPERATIONS_HELP',
                'DOWNLOAD_ERRORS'
            ]
        ]
