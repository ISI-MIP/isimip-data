import json as python_json
import os

from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag()
def json(data):
    return mark_safe(os.linesep + python_json.dumps(data, indent=2) + os.linesep)


@register.filter(is_safe=True)
@stringfilter
def split_br(string):
    return [paragraph for paragraph in string.split('<br>') if paragraph]
