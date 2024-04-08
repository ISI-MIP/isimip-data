import textwrap

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

def get_quote_text(head, text, level, add_newline=False):
    head_indent = ('>' * level + ' ') if level else ''
    text_indent = ('>' * (level + 1) + ' ')
    quote = f'{head_indent}{head}\r\n' + '\r\n'.join(textwrap.wrap(
        text, width=70, initial_indent=text_indent, subsequent_indent=text_indent
    ))

    if add_newline:
        quote += f'\r\n{text_indent}'

    return quote
