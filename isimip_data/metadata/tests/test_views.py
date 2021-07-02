import pytest
from django.core.management import call_command
from django.core.exceptions import ObjectDoesNotExist
from django.urls import reverse


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command('loaddata', 'testing/fixtures/accounts.json')


def test_metadata(client, datasets):
    response = client.get(reverse('metadata'))
    assert response.status_code == 200


def test_metadata_dataset(client, datasets):
    for dataset in datasets:
        url = reverse('metadata') + '?query=' + str(dataset.id)

        response = client.get(url)
        assert response.status_code == 302
        assert response.url == '/datasets/{}/'.format(dataset.id)


def test_metadata_file(client, files):
    for file in files:
        url = reverse('metadata') + '?query=' + str(file.id)

        response = client.get(url)
        assert response.status_code == 302
        assert response.url == '/files/{}/'.format(file.id)


def test_dataset_id(client, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset', args=[dataset.id]))
        try:
            dataset.target
            assert response.status_code == 303
        except ObjectDoesNotExist:
            assert response.status_code == 200


def test_dataset_path(client, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset', args=[dataset.path]))
        try:
            dataset.target
            assert response.status_code == 303
        except ObjectDoesNotExist:
            assert response.status_code == 200


def test_file_id(client, files):
    for file in files:
        response = client.get(reverse('file', args=[file.id]))
        try:
            file.target
            assert response.status_code == 303
        except ObjectDoesNotExist:
            assert response.status_code == 200


def test_file_path(client, files):
    for file in files:
        response = client.get(reverse('file', args=[file.path]))
        try:
            file.target
            assert response.status_code == 303
        except ObjectDoesNotExist:
            assert response.status_code == 200


def test_attributes(client, db):
    response = client.get(reverse('attributes'))
    assert response.status_code == 200


def test_resources(client, db):
    response = client.get(reverse('resources'))
    assert response.status_code == 200
