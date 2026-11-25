from django.conf import settings
from django.test import override_settings
from django.urls import reverse

from isimip_data.metadata.managers import DatasetQuerySet
from isimip_data.metadata.models import Dataset, FacetCount, FacetPair, Identifier
from isimip_data.metadata.viewsets import DatasetViewSet

dataset_id = 'b9f8fbc2-d164-42a4-8eb4-2297edcee75b'


def test_dataset_list(db, client):
    response = client.get(reverse('dataset-list'))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 2


def test_dataset_list_id_filter(db, client):
    response = client.get(reverse('dataset-list') + f'?id={dataset_id}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['id'] == dataset_id


def test_dataset_list_name_filter(db, client):
    name = 'model_ipsum_dolor_sit_amet_var_global_monthly'

    response = client.get(reverse('dataset-list') + f'?name={name}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['name'] == name


def test_dataset_list_path_filter(db, client):
    path = 'round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly'

    response = client.get(reverse('dataset-list') + f'?path={path}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['path'] == path


def test_dataset_list_search_filter(db, client):
    response = client.get(reverse('dataset-list') + '?query=ipsum')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['id'] == dataset_id


def test_dataset_list_version_filter(db, client):
    response = client.get(reverse('dataset-list') + '?version=20200101')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 2


def test_dataset_list_tree_filter(db, client):
    response = client.get(reverse('dataset-list') + '?tree=model%2Fipsum')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['id'] == dataset_id


def test_dataset_list_identifier_filter(db, client):
    response = client.get(reverse('dataset-list') + '?alpha=ipsum')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['specifiers']['alpha'] == 'ipsum'


def test_dataset_suggestions(db, client):
    response = client.get(reverse('dataset-suggestions') + '?query=roun%20madel')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data == ['round model']


def test_dataset_suggestions_empty(db, client):
    response = client.get(reverse('dataset-suggestions'))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data == []


def test_dataset_histogram(db, client):
    identifier = Identifier.objects.using('metadata').first()
    response = client.get(reverse('dataset-histogram', args=[identifier.identifier]))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data == [['ipsum', 1], ['lorem', 1]]


def test_dataset_histogram_not_found(db, client):
    response = client.get(reverse('dataset-histogram', args=['wrong']))

    assert response.status_code == 404


def test_dataset_histogram_served_from_facet_count(db, client, mocker):
    mocker.patch.object(DatasetQuerySet, 'histogram', side_effect=AssertionError('should not be called'))

    response = client.get(reverse('dataset-histogram', args=['alpha']))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data == [['ipsum', 1], ['lorem', 1]]

    # the response must agree with the facet_count table
    expected = sorted(
        FacetCount.objects.using('metadata').filter(identifier='alpha').values_list('specifier', 'count')
    )
    assert sorted(response_data) == [list(item) for item in expected]


def test_dataset_histogram_served_from_facet_pair(db, client, mocker):
    mocker.patch.object(DatasetQuerySet, 'histogram', side_effect=AssertionError('should not be called'))

    # 'model' < 'sector', so this exercises the reverse lookup direction in facet_pair
    response = client.get(reverse('dataset-histogram', args=['model']), {'sector': 'sector2'})
    response_data = response.json()

    assert response.status_code == 200
    assert response_data == [['model', 2]]

    assert (
        FacetPair.objects.using('metadata')
        .filter(identifier_1='model', specifier_1='model', identifier_2='sector', specifier_2='sector2')
        .values_list('count', flat=True)
        .get()
        == 2
    )


def test_dataset_histogram_serves_own_identifier_from_facet_count(db, client, mocker):
    # the only identifier filter present is the facet itself, which is excluded from its
    # own histogram anyway, so this must be served from facet_count
    mocker.patch.object(DatasetQuerySet, 'histogram', side_effect=AssertionError('should not be called'))

    response = client.get(reverse('dataset-histogram', args=['alpha']), {'alpha': 'ipsum'})

    assert response.status_code == 200
    assert response.json() == [['ipsum', 1], ['lorem', 1]]


def test_dataset_histogram_falls_back_to_query(db, client, mocker):
    expected = [['model', 2]]
    mock_histogram = mocker.patch.object(DatasetQuerySet, 'histogram', return_value=expected)

    # two identifier filters cannot be answered from the facet tables
    response = client.get(reverse('dataset-histogram', args=['variable']), {'sector': 'sector', 'model': 'model'})
    assert response.status_code == 200
    assert response.json() == [list(item) for item in expected]

    # nor can a full text search
    response = client.get(reverse('dataset-histogram', args=['variable']), {'query': 'dolor'})
    assert response.status_code == 200
    assert response.json() == [list(item) for item in expected]

    assert mock_histogram.call_count == 2


def test_dataset_facets_served_from_facet_count(db, client, mocker):
    mocker.patch.object(DatasetQuerySet, 'histogram', side_effect=AssertionError('should not be called'))

    response = client.get(reverse('dataset-facets'))
    response_data = response.json()

    assert response.status_code == 200
    assert set(response_data.keys()) == {
        facet['identifier'] for group in settings.SEARCH_FACETS for facet in group
    }
    assert response_data['model'] == [['model', 2]]
    assert response_data['product'] == [['product', 2]]


def test_dataset_facets_served_from_facet_pair(db, client, mocker):
    mocker.patch.object(DatasetQuerySet, 'histogram', side_effect=AssertionError('should not be called'))

    response = client.get(reverse('dataset-facets'), {'sector': 'sector2'})
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['model'] == [['model', 2]]
    assert response_data['variable'] == [['var', 2]]

    # the facet of the applied filter itself is served unfiltered, from facet_count
    assert response_data['sector'] == [['sector', 2], ['sector2', 2]]


def test_dataset_facets_falls_back_to_query(db, client, mocker):
    mock_histogram = mocker.patch.object(DatasetQuerySet, 'histogram', return_value=[('model', 2)])

    response = client.get(reverse('dataset-facets'), {'query': 'dolor'})
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['model'] == [['model', 2]]

    facets = [facet['identifier'] for group in settings.SEARCH_FACETS for facet in group]
    assert mock_histogram.call_count == len(facets)
    assert set(response_data.keys()) == set(facets)


@override_settings(METADATA_MAX_FACET_VALUES=1)
def test_dataset_facets_caps_values(db, client, mocker):
    mocker.patch.object(DatasetQuerySet, 'histogram', side_effect=AssertionError('should not be called'))

    response = client.get(reverse('dataset-facets'))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['sector'] == [['sector', 2]]


@override_settings(METADATA_MAX_FACET_VALUES=3)
def test_facet_values_keeps_most_frequent_and_nulls_last():
    # histograms computed from the datasets table contain null specifiers for datasets
    # without the facet; those sort last, also when the cap keeps the most frequent values
    assert DatasetViewSet().facet_values([('b', 5), ('a', 4), (None, 3), ('c', 2)]) == [('a', 4), ('b', 5), (None, 3)]


def test_dataset_filelist(db, client):
    response = client.get(reverse('dataset-filelist'))

    assert response.status_code == 200
    assert response.content


def test_dataset_detail(db, client):
    response = client.get(reverse('dataset-detail', args=[dataset_id]))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['id'] == dataset_id


def test_dataset_detail_target(db, client):
    dataset = Dataset.objects.using('metadata').exclude(target=None).first()
    response = client.get(reverse('dataset-detail', args=[dataset.id]))

    assert response.status_code == 404


def test_dataset_detail_filelist(db, client):
    dataset = Dataset.objects.using('metadata').filter(target=None).first()
    response = client.get(reverse('dataset-detail-filelist', args=[dataset.id]))

    assert response.status_code == 200
    assert response.content


def test_dataset_detail_filelist_target(db, client):
    dataset = Dataset.objects.using('metadata').exclude(target=None).first()
    response = client.get(reverse('dataset-detail-filelist', args=[dataset.id]))

    assert response.status_code == 404


def test_dataset_detail_manifest(db, client):
    dataset = Dataset.objects.using('metadata').filter(target=None).first()
    response = client.get(reverse('dataset-detail-manifest', args=[dataset.id]))

    assert response.status_code == 200
    assert response.content
