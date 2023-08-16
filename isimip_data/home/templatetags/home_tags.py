from django import template

from ..utils import get_home_links

register = template.Library()


@register.inclusion_tag('home/tags/home_list.html')
def home_list(product, key):
    return {
        'links': get_home_links(product, key),
        'inline': False
    }


@register.inclusion_tag('home/tags/home_list.html')
def home_inline_list(product, key):
    return {
        'links': get_home_links(product, key),
        'inline': True
    }
