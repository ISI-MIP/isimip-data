from django.conf import settings


def trailing_slash(string):
    if string is None:
        return string
    else:
        return string.rstrip('/') + '/'


def via_proxy(request):
    remote_addr = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR')
    return settings.PROXY and (remote_addr in settings.PROXY)


def get_file_base_url(request):
    url = settings.PROXY_FILES_BASE_URL if via_proxy(request) else settings.FILES_BASE_URL
    return trailing_slash(url)


def get_file_api_url(request):
    url = settings.PROXY_FILES_API_URL if via_proxy(request) else settings.FILES_API_URL
    return trailing_slash(url)


def get_full_name(user):
    if user.first_name and user.last_name:
        return f'{user.first_name} {user.last_name}'
    else:
        return user.username
