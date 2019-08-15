from django.conf import settings
from django.contrib.postgres.search import SearchQuery, SearchRank

from rest_framework.filters import BaseFilterBackend


class SearchFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):

        search = request.GET.get('search')
        if search:
            search_query = SearchQuery(search)
            search_rank = SearchRank('search_vector', search)

            queryset = queryset.filter(
                search_vector=search_query
            ).annotate(
                search_rank=search_rank
            ).order_by('-search_rank')

        return queryset


class AttributeFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        # see https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#std:fieldlookup-hstorefield.contains
        # and https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#containment-and-key-operations
        # for optimal jsonb lookups: queryset.filter(field={'foo': 'bar', 'egg': 'spam'})

        attribute_filter = {}
        for key in settings.ATTRIBUTES_FILTER:
            value = request.GET.get(key)
            if value:
                attribute_filter[key] = value

        if attribute_filter:
            queryset = queryset.filter(attributes__contains=attribute_filter)

        return queryset
