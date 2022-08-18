import json as python_json
import os

from django import template
from django.conf import settings
from django.template.defaultfilters import stringfilter
from django.urls import reverse
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag()
def json(data):
    return mark_safe(os.linesep + python_json.dumps(data, indent=2) + os.linesep)


@register.inclusion_tag('core/tags/home_list.html')
def home_list(product, category_or_sector):
    return {
        'links': [
            (simulation_round, reverse('search', args=['tree/{}%2F{}%2F{}'.format(simulation_round, product, category_or_sector)]))
            for simulation_round in settings.HOME[category_or_sector]
        ],
        'inline': False
    }


@register.inclusion_tag('core/tags/home_list.html')
def home_inline_list(product, category_or_sector):
    return {
        'links': [
            (simulation_round, reverse('search', args=['tree/{}%2F{}%2F{}'.format(simulation_round, product, category_or_sector)]))
            for simulation_round in settings.HOME[category_or_sector]
        ],
        'inline': True
    }


@register.filter(is_safe=True)
@stringfilter
def split_br(string):
    return [paragraph for paragraph in string.split('<br>') if paragraph]
