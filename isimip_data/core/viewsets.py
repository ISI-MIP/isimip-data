from django.conf import settings
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import SettingsSerializer
from .utils import get_file_base_url, get_file_api_url


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
            }
        ] + [
            {
                'key': key,
                'value': getattr(settings, key)
            } for key in [
                'METADATA_PAGE_SIZE',
                'DOWNLOAD_LABEL_CUTOUT_BBOX',
                'DOWNLOAD_LABEL_MASK_COUNTRY',
                'DOWNLOAD_LABEL_MASK_BBOX',
                'DOWNLOAD_LABEL_MASK_LANDONLY',
                'DOWNLOAD_LABEL_SELECT_COUNTRY',
                'DOWNLOAD_LABEL_SELECT_BBOX',
                'DOWNLOAD_LABEL_SELECT_POINT',
                'DOWNLOAD_HELP_CUTOUT',
                'DOWNLOAD_HELP_CUTOUT_BBOX',
                'DOWNLOAD_HELP_MASK',
                'DOWNLOAD_HELP_MASK_COUNTRY',
                'DOWNLOAD_HELP_MASK_BBOX',
                'DOWNLOAD_HELP_MASK_LANDONLY',
                'DOWNLOAD_HELP_SELECT',
                'DOWNLOAD_HELP_SELECT_COUNTRY',
                'DOWNLOAD_HELP_SELECT_BBOX',
                'DOWNLOAD_HELP_SELECT_POINT'
            ]
        ]
