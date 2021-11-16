from django.conf import settings


def is_using_proxy(request):
    return settings.PROXY and request.META['REMOTE_ADDR'] == settings.PROXY


def get_file_base_url(request):
    if is_using_proxy(request):
        return settings.PROXY_FILES_BASE_URL.rstrip('/') + '/'
    else:
        return settings.FILES_BASE_URL.rstrip('/') + '/'


def get_file_api_url(request):
    if is_using_proxy(request):
        return settings.PROXY_FILES_API_URL.rstrip('/') + '/'
    else:
        return settings.FILES_API_URL.rstrip('/') + '/'
