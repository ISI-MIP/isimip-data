import logging

from django.contrib.postgres.search import SearchQuery
from django.core.exceptions import ValidationError
from django.db.models import Q

from rest_framework.filters import BaseFilterBackend

from .models import File, Identifier
from .utils import split_query_string

logger = logging.getLogger(__name__)


class IdFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        ids = request.GET.getlist('id')
        if ids:
            try:
                queryset = queryset.filter(id__in=ids)
            except ValidationError:
                pass

        return queryset


class DatasetFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        dataset_ids = request.GET.getlist('dataset')

        if dataset_ids:
            queryset = queryset.filter(dataset_id__in=dataset_ids)

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
                filter_kwargs = {'path__startswith': path}

                if getattr(view, 'filter_resolve_links', True):
                    subquery = queryset.model.objects.filter(**filter_kwargs).values('root_id').order_by()
                    q |= Q(root_id__in=subquery)
                else:
                    q |= Q(**filter_kwargs)

            queryset = queryset.filter(q)

        return queryset


class SearchFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        # this is the complicated part, we use full text search here
        # see https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/search/
        # and http://rachbelaid.com/postgres-full-text-search-is-good-enough/
        query = request.GET.get('query')
        if query:
            # first, split the search string whitespace into words
            query_strings = [query_string for query_string in split_query_string(query) if query_string]

            # next, join the search_strings for the different search_words with an AND
            search_string = ' & '.join(query_strings)
            logger.debug('search_string = %s', search_string)

            # get the search_query
            search_query = SearchQuery(search_string, search_type='raw')

            # last, perform a full text search on the search_vector field
            if queryset.model == File:
                filter_kwargs = {'dataset__search__vector': search_query}
            else:
                filter_kwargs = {'search__vector': search_query}

            if getattr(view, 'filter_resolve_links', True):
                subquery = queryset.model.objects.filter(**filter_kwargs).values('root_id').order_by()
                queryset = queryset.filter(root_id__in=subquery)
            else:
                queryset = queryset.filter(**filter_kwargs)

        return queryset


class VersionFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        if request.GET.get('all') != 'true':
            if queryset.model == File:
                queryset = queryset.filter(dataset__public=True)
            else:
                queryset = queryset.filter(public=True)

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

        for identifier in Identifier.objects.using('metadata').identifiers():
            if identifier != getattr(view, 'filter_exclude_identifier', None):
                q = Q()
                for value in request.GET.getlist(identifier):
                    if value:
                        filter_kwargs = {'specifiers__contains': {identifier: value}}

                        if getattr(view, 'filter_resolve_links', True):
                            subquery = queryset.model.objects.filter(**filter_kwargs).values('root_id').order_by()
                            q |= Q(root_id__in=subquery)
                        else:
                            q |= Q(**filter_kwargs)

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
                tree = tree.rstrip('/') + '/'

                if queryset.model == File:
                    filter_kwargs = {'dataset__tree_path__startswith': tree}
                else:
                    filter_kwargs = {'tree_path__startswith': tree}

                if getattr(view, 'filter_resolve_links', True):
                    subquery = queryset.model.objects.filter(**filter_kwargs).values('root_id').order_by()
                    q |= Q(root_id__in=subquery)
                else:
                    q |= Q(**filter_kwargs)

            queryset = queryset.filter(q)

        return queryset


class ChecksumFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        checksum = request.GET.get('checksum')
        if checksum:
            try:
                queryset = queryset.filter(checksum=checksum)
            except ValidationError:
                pass

        return queryset
