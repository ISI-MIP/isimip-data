from django import template

from ..utils import get_home_links

register = template.Library()


@register.inclusion_tag('home/tags/home_list.html')
def home_list(product, category_sector_publication):
    return {
        'links': get_home_links(product, category_sector_publication)
    }


@register.inclusion_tag('home/tags/home_inline_list.html')
def home_inline_list(product, category_sector_publication):
    return {
        'links': get_home_links(product, category_sector_publication)
    }
