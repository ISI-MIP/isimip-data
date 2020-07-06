from datetime import datetime

from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()


@register.filter
@stringfilter
def to_datetime(value):
    return datetime.strptime(value, '%Y-%m-%d')
