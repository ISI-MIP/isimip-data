from django.conf import settings


def via_proxy(request):
    remote_addr = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR')
    return settings.PROXY and (remote_addr in settings.PROXY)


def get_file_base_url(request):
    return settings.PROXY_FILES_BASE_URL if via_proxy(request) else settings.FILES_BASE_URL


def get_file_api_url(request):
    return settings.PROXY_FILES_API_URL if via_proxy(request) else settings.FILES_API_URL
