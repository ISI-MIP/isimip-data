from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from isimip_data.core.utils import get_file_api_url
from isimip_data.metadata.models import File


@csrf_exempt
def download(request, job_id=None):
    paths = request.POST.getlist('paths')
    files = File.objects.using('metadata').filter(path__in=paths, dataset__public=True)

    return render(request, 'download/download.html', {
        'title': 'Configure download',
        'job_url': get_file_api_url(request) + job_id if job_id else None,
        'files': [
            {
                'path': file.path,
                'specifiers': file.specifiers
            } for file in files
        ]
    })
