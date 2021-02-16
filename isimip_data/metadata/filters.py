import logging

from django.conf import settings
from django.contrib.postgres.search import (SearchQuery, SearchRank,
                                            TrigramSimilarity)
from django.db.models import Q
from rest_framework.filters import BaseFilterBackend

from isimip_data.metadata.models import Attribute, Word

logger = logging.getLogger(__name__)


class IdFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        ids = request.GET.getlist('id')
        if ids:
            queryset = queryset.filter(id__in=ids)

        return queryset


class NameFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        name = request.GET.getlist('name')
        if name:
            queryset = queryset.filter(name__in=name)

        return queryset


class PathFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        path_list = request.GET.getlist('path')
        if path_list:
            q = Q()
            for path in path_list:
                q |= Q(path__startswith=path)
            queryset = queryset.filter(q)

        return queryset


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

        if request.GET.get('all') != 'true':
            queryset = queryset.filter(public=True)

        after = request.GET.get('after')
        if after:
            queryset = queryset.filter(version__gte=after)

        before = request.GET.get('before')
        if before:
            queryset = queryset.filter(version__lte=before)

        return queryset


class AttributeFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        # see https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#std:fieldlookup-hstorefield.contains
        # and https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#containment-and-key-operations
        # for optimal jsonb lookups: queryset.filter(field={'foo': 'bar', 'egg': 'spam'})
        for identifier in Attribute.objects.using('metadata').identifiers():
            if identifier != getattr(view, 'attribute_filter_exclude', None):
                q = Q()
                for value in request.GET.getlist(identifier):
                    if value:
                        q |= Q(specifiers__contains={identifier: value})
                queryset = queryset.filter(q)

        return queryset


class TreeFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        tree_list = request.GET.getlist('tree')
        if tree_list:
            q = Q()
            for tree in tree_list:
                q |= Q(tree_path__startswith=tree)

            queryset = queryset.filter(q)

        return queryset
