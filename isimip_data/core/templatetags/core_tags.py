from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()


@register.filter(is_safe=True)
@stringfilter
def split_br(string):
    return [paragraph for paragraph in string.split('<br>') if paragraph]
