from django.conf import settings
from django.utils.http import content_disposition_header

from rest_framework.response import Response


class AttachmentResponse(Response):
    def __init__(self, *args, **kwargs):
        file_name = kwargs.pop('file_name', None)

        super().__init__(*args, **kwargs)

        if file_name and settings.CONTENT_DISPOSITION == 'attachment':
            self['Content-Disposition'] = content_disposition_header(as_attachment=True, filename=file_name)
