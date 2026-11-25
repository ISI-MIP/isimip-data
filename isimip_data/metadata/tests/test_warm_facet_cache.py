from django.core.management import call_command
from django.test import Client, override_settings

from isimip_data.metadata.viewsets import DatasetViewSet


def warmed_urls(mocker, **options):
    client = mocker.patch('isimip_data.metadata.management.commands.warm_facet_cache.Client').return_value
    client.get.return_value.status_code = 200

    call_command('warm_facet_cache', **options)

    return [call.args[0] for call in client.get.call_args_list]


def test_warm_facet_cache_warms_the_facet_endpoint(db, mocker):
    urls = warmed_urls(mocker)

    assert urls[0] == '/api/v1/datasets/facets/'
    assert '/api/v1/datasets/facets/?sector=sector' in urls
    assert '/api/v1/datasets/facets/?sector=sector2' in urls


def test_warm_facet_cache_limits_values_per_identifier(db, mocker):
    urls = warmed_urls(mocker, values_per_identifier=1)

    # sector and sector2 have the same count, so with a limit of one the alphabetically
    # first value is kept
    assert '/api/v1/datasets/facets/?sector=sector' in urls
    assert '/api/v1/datasets/facets/?sector=sector2' not in urls


def test_warm_facet_cache_warms_pairs(db, mocker):
    urls = warmed_urls(mocker, pairs=True)

    assert '/api/v1/datasets/facets/?product=product&sector=sector' in urls
    assert '/api/v1/datasets/facets/?product=product&sector=sector2' in urls


@override_settings(
    ALLOWED_HOSTS=['localhost'],
    CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache', 'LOCATION': 'test-warm-facets'}},
)
def test_warm_facet_cache_serves_from_cache(db, mocker):
    call_command('warm_facet_cache')  # defaults --host to the first ALLOWED_HOSTS entry

    mocker.patch.object(DatasetViewSet, 'fast_histograms', side_effect=AssertionError('must be served from cache'))
    mocker.patch.object(DatasetViewSet, 'computed_histograms', side_effect=AssertionError('must be served from cache'))

    response = Client(SERVER_NAME='localhost', HTTP_ACCEPT='*/*').get('/api/v1/datasets/facets/')
    assert response.status_code == 200


@override_settings(
    ALLOWED_HOSTS=['localhost'],
    CACHES={
        'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache', 'LOCATION': 'test-parameter-order'}
    },
)
def test_response_cache_is_independent_of_parameter_order(db, mocker):
    client = Client(SERVER_NAME='localhost', HTTP_ACCEPT='*/*')

    # the warming command enumerates the parameters in configuration order …
    assert client.get('/api/v1/datasets/facets/?product=product&sector=sector2').status_code == 200

    mocker.patch.object(DatasetViewSet, 'fast_histograms', side_effect=AssertionError('must be served from cache'))
    mocker.patch.object(DatasetViewSet, 'computed_histograms', side_effect=AssertionError('must be served from cache'))

    # … while a client requests them in the order of its filter interaction
    response = client.get('/api/v1/datasets/facets/?sector=sector2&product=product')
    assert response.status_code == 200
