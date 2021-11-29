from django.shortcuts import render

from isimip_data.core.utils import get_file_api_url
from isimip_data.metadata.models import File


def download(request, job_id=None):
    paths = request.POST.getlist('paths')
    files = File.objects.using('metadata').filter(path__in=paths)

    return render(request, 'download/download.html', {
        'title': 'Configure download',
        'job_url': get_file_api_url() + job_id if job_id else None,
        'files': [
            {
                'path': file.path,
                'specifiers': file.specifiers
            } for file in files
        ]
    })
