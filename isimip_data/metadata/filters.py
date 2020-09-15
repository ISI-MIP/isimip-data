import logging
from pathlib import PurePath

from django.conf import settings
from django.contrib.postgres.search import (SearchQuery, SearchRank,
                                            TrigramSimilarity)
from django.db.models import Q
from django.db.models.expressions import RawSQL
from rest_framework.filters import BaseFilterBackend

from isimip_data.metadata.models import Attribute, Word

logger = logging.getLogger(__name__)


class SearchFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

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
                words = Word.objects.using('metadata') \
                                    .annotate(similarity=TrigramSimilarity('word', search_word)) \
                                    .filter(similarity__gt=settings.SEARCH_SIMILARITY) \
                                    .order_by('-similarity') \
                                    .values_list('word', flat=True)[:settings.SEARCH_SIMILARITY_LIMIT]

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
        if view.detail:
            return queryset

        # display all datasets or only the public version
        if request.GET.get('all') == 'true':
            return queryset
        else:
            return queryset.filter(public=True)


class AttributeFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        # see https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#std:fieldlookup-hstorefield.contains
        # and https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#containment-and-key-operations
        # for optimal jsonb lookups: queryset.filter(field={'foo': 'bar', 'egg': 'spam'})
        if view.detail:
            return queryset

        for attribute in Attribute.objects.using('metadata').all():
            if attribute.key != getattr(view, 'attribute_filter_exclude', None):
                q = Q()
                for value in request.GET.getlist(attribute.key):
                    if value:
                        q |= Q(specifiers__contains={attribute.key: value})
                queryset = queryset.filter(q)

        return queryset


class PathFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        path_list = request.GET.getlist('path')
        if path_list:
            q = Q()
            for path in path_list:
                q |= Q(path__startswith=path)
            queryset = queryset.filter(q)

        return queryset


class TreeFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        trace_list = request.GET.getlist('trace')
        if trace_list:
            q = Q()
            for trace in trace_list:
                q |= Q(trace__startswith=trace)

            queryset = queryset.annotate(trace=RawSQL('''
                array_to_string(ARRAY(select specifiers->>identifier from unnest(identifiers) as identifier), '/')
            ''', ())).filter(q)

        return queryset
