from django.shortcuts import render

from isimip_data.core.utils import get_file_api_url


def download(request, job_id=None):
    return render(request, 'download/download.html', {
        'job_url': get_file_api_url() + job_id if job_id else None,
        'paths': request.POST.getlist('paths')
    })
