import textwrap

from django.conf import settings
from django.template.defaultfilters import date
from django.template.loader import get_template


def get_download_operations(request):
    return [
        {
            key: get_template(value).render(request=request)
            if key == 'template' else value
            for key, value in operation.items()
        }
        for operation in settings.DOWNLOAD_OPERATIONS
    ]

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

def get_date_display(value):
    return date(value, settings.DATETIME_FORMAT)
