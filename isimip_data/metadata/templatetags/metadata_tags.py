from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def citation(citation, identifier, identifier_type):
    string = citation

    if identifier_type == 'DOI':
        string = string.replace(identifier, '')
        string += ' <a class="doi-link" target="_blank" href="{}">{}</a>'.format(identifier_type, identifier)
    elif identifier_type == 'URL':
        string = string.replace(identifier, '')
        string += ' &nbsp;&rarr;'
        string += ' <a target="_blank" href="{}">{}</a>'.format(identifier_type, identifier)

    return mark_safe(string)
