import pytest
from django.core.management import call_command
from django.urls import reverse


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command('loaddata', 'testing/fixtures/auth.json')


def test_metadata(client):
    response = client.get(reverse('metadata'))
    assert response.status_code == 200


def test_metadata_dataset(client, datasets):
    for dataset in datasets:
        url = reverse('metadata') + '?dataset=' + dataset.checksum

        response = client.get(url)
        assert response.status_code == 302
        assert response.url == '/datasets/{}/'.format(dataset.checksum)


def test_metadata_file(client, files):
    for file in files:
        url = reverse('metadata') + '?file=' + file.checksum

        response = client.get(url)
        assert response.status_code == 302
        assert response.url == '/files/{}/'.format(file.checksum)


def test_dataset_id(client, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset', args=[dataset.id]))
        assert response.status_code == 200


def test_dataset_path(client, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset', args=[dataset.path]))
        assert response.status_code == 200


def test_dataset_checksum(client, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset', args=[dataset.checksum]))
        assert response.status_code == 200


def test_file_id(client, files):
    for file in files:
        response = client.get(reverse('file', args=[file.id]))
        assert response.status_code == 200


def test_file_path(client, files):
    for file in files:
        response = client.get(reverse('file', args=[file.path]))
        assert response.status_code == 200


def test_file_checksum(client, files):
    for file in files:
        response = client.get(reverse('file', args=[file.checksum]))
        assert response.status_code == 200


@pytest.mark.parametrize('username,password,status_code', (
    ('admin', 'admin', 200),
    ('anonymous', None, 302)
))
def test_attributes(client, db, username, password, status_code):
    client.login(username=username, password=password)

    response = client.get(reverse('attributes'))
    assert response.status_code == status_code
