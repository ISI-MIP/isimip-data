from django import template

from ..utils import get_home_links

register = template.Library()


@register.inclusion_tag('home/tags/home_list.html', takes_context=True)
def home_list(context, product, category_sector_publication):
    return {
        'links': get_home_links(context['tree'], product, category_sector_publication)
    }


@register.inclusion_tag('home/tags/home_inline_list.html', takes_context=True)
def home_inline_list(context, product, category_sector_publication):
    return {
        'links': get_home_links(context['tree'], product, category_sector_publication)
    }
