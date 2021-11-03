from django.conf import settings
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import SettingsSerializer


class SettingsViewSet(ListModelMixin, GenericViewSet):

    serializer_class = SettingsSerializer
    queryset = [
        {
            'key': key,
            'value': getattr(settings, key)
        } for key in [
            'FILES_BASE_URL',
            'FILES_API_URL',
            'METADATA_PAGE_SIZE',
            'DOWNLOAD_HELP_CUTOUT_BBOX',
            'DOWNLOAD_HELP_MASK_COUNTRY',
            'DOWNLOAD_HELP_MASK_BBOX',
            'DOWNLOAD_HELP_MASK_LANDONLY'
        ]
    ]
