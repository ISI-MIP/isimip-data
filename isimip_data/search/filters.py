import logging

from django.conf import settings
from django.contrib.postgres.search import SearchQuery, SearchRank, TrigramSimilarity
from django.db.models import Q

from rest_framework.filters import BaseFilterBackend

from isimip_data.metadata.models import Word

from .models import Facet

logger = logging.getLogger(__name__)


class SearchFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        # this is the compicated part, we emply both trigram similarity and full text search here
        search = request.GET.get('search')
        if search:
            # first, split the search string along _ and whitespace into words
            search_words = search.replace('_', ' ').split()

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

            # last, perform a full text search with ranking on the search_vector field
            queryset = queryset.filter(
                search_vector=SearchQuery(search_string, search_type='raw')
            ).annotate(
                search_rank=SearchRank('search_vector', search_string),
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
            if facet.attribute != getattr(view, 'attribute_filter_exclude', None):
                q = Q()
                for value in request.GET.getlist(attribute):
                    if value:
                        q |= Q(attributes__contains={attribute: value})
                queryset = queryset.filter(q)

        return queryset
