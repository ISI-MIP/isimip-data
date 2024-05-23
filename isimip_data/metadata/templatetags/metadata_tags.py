import re

from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def citation(citation, identifier, identifier_type):
    string = citation

    if identifier_type == 'DOI':
        string = string.replace(identifier, f'<a class="doi-link" target="_blank" href="{identifier}">{identifier}</a>')
    elif identifier_type == 'URL':
        string = string.replace(identifier, f'&nbsp;&rarr; <a target="_blank" href="{identifier}">{identifier}</a>')

    return mark_safe(string)


@register.simple_tag
def restricted_message(obj):
    for path, message in settings.RESTRICTED_MESSAGES.items():
        if obj.path.startswith(path):
            return mark_safe(message)

    return mark_safe(settings.RESTRICTED_DEFAULT_MESSAGE)


@register.filter
def replace_caveats(value):
    # replaces, e.g. <a ...>https://data.isimip.org/caveats/8/</a>
    # with <a ...>#8</a>
    return mark_safe(re.sub(r'(<a.*?>)(https://data\.isimip\.org/caveats/.*?)(\d+)([/]*)(</a>)',
                            r'\1#\3\5', value))
