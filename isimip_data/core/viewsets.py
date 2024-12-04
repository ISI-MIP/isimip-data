from django.conf import settings

from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import SettingsSerializer
from .utils import get_download_operations, get_file_api_url, get_file_base_url


class SettingsViewSet(ListModelMixin, GenericViewSet):

    serializer_class = SettingsSerializer

    def get_queryset(self):
        return [
            {
                'key': 'FILES_BASE_URL',
                'value': get_file_base_url(self.request),
            },
            {
                'key': 'FILES_API_URL',
                'value': get_file_api_url(self.request),
            },
            {
                'key': 'DOWNLOAD_OPERATIONS',
                'value': get_download_operations(self.request),
            }
        ] + [
            {
                'key': key,
                'value': getattr(settings, key)
            } for key in [
                'METADATA_PAGE_SIZE',
                'METADATA_MAX_COUNT',
                'DOWNLOAD_OPERATIONS_HELP',
                'DOWNLOAD_ERRORS'
            ]
        ]
