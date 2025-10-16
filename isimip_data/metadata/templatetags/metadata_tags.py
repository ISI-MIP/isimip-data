import re

from django import template
from django.conf import settings
from django.template.defaultfilters import urlize
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
def render_description(value):
    description = urlize(value)

    # replaces, e.g. <a ...>https://data.isimip.org/issues/8/</a>
    # with <a ...>#8</a>
    description = re.sub(r'(<a.*?>)(https://data\.isimip\.org/(caveats|issues|notes)/.*?)(\d+)([/]*)(</a>)',
                         r'\1#\4\6', description)

    if value.endswith('.') and not description.endswith('.'):
        description += '.'

    return mark_safe(description)
