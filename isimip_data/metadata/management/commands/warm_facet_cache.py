from itertools import combinations, product
from urllib.parse import quote

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import ProgrammingError
from django.test import Client

from isimip_data.metadata.models import FacetCount


class Command(BaseCommand):
    help = """
        Warm the response cache for the facet endpoint: request the facets of the unfiltered
        state and of single-value identifier filters (and, with --pairs, of two-identifier
        combinations within the first SEARCH_FACETS group) through the request/response cache
        middleware, so that no user has to compute a cold facet response after each metadata
        ingest cleared the cache.

        Run this on the application server after the metadata pipeline refreshed the facet
        tables. The host used for the requests must match the host of the real requests to
        share their cache keys, hence the --host option.
        """

    def add_arguments(self, parser):
        parser.add_argument(
            '--host',
            default=(settings.ALLOWED_HOSTS or ['localhost'])[0],
            help='Host header to use, must match the host of real requests (default: the first ALLOWED_HOSTS entry)',
        )
        parser.add_argument(
            '--values-per-identifier',
            type=int,
            default=0,
            help='limit the warmed filter values per identifier, most frequent first (0 = all)',
        )
        parser.add_argument(
            '--pairs',
            action='store_true',
            help='also warm two-identifier filter combinations within the first SEARCH_FACETS group',
        )
        parser.add_argument(
            '--pairs-values',
            type=int,
            default=5,
            help='number of values per identifier to combine with --pairs (default: 5)',
        )

    def urls(self, options):
        yield '/api/v1/datasets/facets/'

        limit = options['values_per_identifier']
        counts = {}
        for identifier, specifier in FacetCount.objects.using('metadata').order_by(
            'identifier', '-count', 'specifier'
        ).values_list('identifier', 'specifier'):
            if limit and counts.get(identifier, 0) >= limit:
                continue
            counts[identifier] = counts.get(identifier, 0) + 1
            yield f'/api/v1/datasets/facets/?{quote(identifier)}={quote(specifier)}'

        if options['pairs']:
            identifiers = [facet['identifier'] for facet in settings.SEARCH_FACETS[0]]
            values = {}
            for identifier in identifiers:
                values[identifier] = list(
                    FacetCount.objects.using('metadata')
                    .filter(identifier=identifier)
                    .order_by('-count', 'specifier')
                    .values_list('specifier', flat=True)[: options['pairs_values']]
                )
            for first, second in combinations(identifiers, 2):
                for value_1, value_2 in product(values[first], values[second]):
                    yield (
                        f'/api/v1/datasets/facets/'
                        f'?{quote(first)}={quote(value_1)}&{quote(second)}={quote(value_2)}'
                    )

    def handle(self, *args, **options):
        # Accept as the webapp's fetch sends it, so the responses are cached under the
        # keys the real requests use
        client = Client(SERVER_NAME=options['host'], HTTP_ACCEPT='*/*')

        try:
            urls = list(self.urls(options))
        except ProgrammingError:
            # the facet tables do not (yet) exist in the metadata database
            self.stderr.write(self.style.ERROR('The facet tables do not exist in the metadata database.'))
            return

        warmed = 0
        for url in urls:
            response = client.get(url)
            if response.status_code == 200:
                warmed += 1
            else:
                self.stderr.write(self.style.WARNING(f'Warming {url} returned HTTP {response.status_code}'))

        self.stdout.write(self.style.SUCCESS(f'Warmed {warmed} of {len(urls)} facet responses.'))
