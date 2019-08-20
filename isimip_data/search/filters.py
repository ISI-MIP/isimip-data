from django.conf import settings
from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models import Q

from rest_framework.filters import BaseFilterBackend

from .models import Facet


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

        facets = Facet.objects.all()
        for facet in facets:
            attribute = facet.attribute
            if facet.attribute != view.attribute_filter_exclude:
                q = Q()
                for value in request.GET.getlist(attribute):
                    if value:
                        q |= Q(attributes__contains={attribute: value})
                queryset = queryset.filter(q)

        return queryset