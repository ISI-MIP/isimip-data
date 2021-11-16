from django.conf import settings
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def download(request, job_id=None):
    return render(request, 'download/download.html', {
        'job_url': settings.FILES_API_URL + job_id if job_id else None,
        'paths': request.POST.getlist('paths')
    })
