import logging

from django.conf import settings
from django.contrib.postgres.search import (SearchQuery, SearchRank,
                                            TrigramSimilarity)
from django.db.models import Q
from isimip_data.metadata.models import Attribute, Word
from rest_framework.filters import BaseFilterBackend

logger = logging.getLogger(__name__)


class SearchFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        # this is the compicated part, we emply both trigram similarity and full text search here
        # see https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/search/
        # and http://rachbelaid.com/postgres-full-text-search-is-good-enough/
        query = request.GET.get('query')
        if query:
            # first, split the search string along _ and whitespace into words
            search_words = query.replace('_', ' ').replace('-', ' ').replace('/', ' ').split()

            # second, lookup similar words in the "words" table and join them with OR
            search_strings = []
            for search_word in search_words:
                words = Word.objects.using('metadata').annotate(
                    similarity=TrigramSimilarity('word', search_word)
                ).filter(similarity__gt=settings.SEARCH_SIMILARITY).order_by('-similarity').values_list('word', flat=True)

                if words:
                    search_strings.append('(%s)' % ' | '.join(words))

            # next, join the search_strings for the different search_words with an AND
            search_string = ' & '.join(search_strings)
            logger.debug('search_string = %s', search_string)

            # get the search_query and the search_rank objects
            search_query = SearchQuery(search_string, search_type='raw')
            search_rank = SearchRank('search_vector', search_query)

            # last, perform a full text search with ranking on the search_vector field
            queryset = queryset.filter(
                search_vector=search_query
            ).annotate(
                search_rank=search_rank,
            ).order_by('-search_rank', 'name')

        return queryset


class VersionFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        # display all datasets or only the latest version
        # the latest versions are stored in a materialized view called "latest"

        if request.GET.get('all') == 'true':
            return queryset
        else:
            return queryset.exclude(latest=None)


class AttributeFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        # see https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#std:fieldlookup-hstorefield.contains
        # and https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#containment-and-key-operations
        # for optimal jsonb lookups: queryset.filter(field={'foo': 'bar', 'egg': 'spam'})

        for attribute in Attribute.objects.using('metadata').all():
            if attribute.key != getattr(view, 'attribute_filter_exclude', None):
                q = Q()
                for value in request.GET.getlist(attribute.key):
                    if value:
                        q |= Q(attributes__contains={attribute.key: value})
                queryset = queryset.filter(q)

        return queryset
