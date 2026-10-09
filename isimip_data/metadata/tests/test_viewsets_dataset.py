from django.urls import reverse

from isimip_data.metadata.models import Dataset, Identifier

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
