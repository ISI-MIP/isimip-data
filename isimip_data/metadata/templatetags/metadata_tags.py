from django import template
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
