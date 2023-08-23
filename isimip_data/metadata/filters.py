import logging

from django.contrib.postgres.search import SearchQuery
from django.core.exceptions import FieldError
from django.db.models import Q

from rest_framework.filters import BaseFilterBackend

from .models import Identifier
from .utils import split_query_string

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
                q |= Q(path__startswith=path) | Q(links__path__startswith=path)
            queryset = queryset.filter(q)

        return queryset


class SearchFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        # this is the compicated part, we use full text search here
        # see https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/search/
        # and http://rachbelaid.com/postgres-full-text-search-is-good-enough/
        query = request.GET.get('query')
        if query:
            # first, split the search string whitespace into words
            query_strings = split_query_string(query)

            # next, join the search_strings for the different search_words with an AND
            search_string = ' & '.join(query_strings)
            logger.debug('search_string = %s', search_string)

            # get the search_query
            search_query = SearchQuery(search_string, search_type='raw')

            # last, perform a full text search on the search_vector field
            try:
                queryset = queryset.filter(search__vector=search_query)
            except FieldError:
                queryset = queryset.filter(dataset__search__vector=search_query)

        return queryset


class VersionFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        if request.GET.get('all') != 'true':
            try:
                # datasets have a public field
                queryset = queryset.filter(public=True)
            except FieldError:
                # files need to check the public field of the corresponding dataset
                queryset = queryset.filter(dataset__public=True)

        after = request.GET.get('after')
        if after:
            queryset = queryset.filter(version__gte=after)

        before = request.GET.get('before')
        if before:
            queryset = queryset.filter(version__lte=before)

        return queryset


class IdentifierFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        # see https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#std:fieldlookup-hstorefield.contains
        # and https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#containment-and-key-operations
        # for optimal jsonb lookups: queryset.filter(field={'foo': 'bar', 'egg': 'spam'})
        for identifier in Identifier.objects.using('metadata').identifiers():
            if identifier != getattr(view, 'identifier_filter_exclude', None):
                q = Q()
                for value in request.GET.getlist(identifier):
                    if value:
                        q |= Q(specifiers__contains={identifier: value}) | Q(links__specifiers__contains={identifier: value})
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
                q |= Q(tree_path__startswith=tree) | Q(links__tree_path__startswith=tree)

            queryset = queryset.filter(q)

        return queryset
