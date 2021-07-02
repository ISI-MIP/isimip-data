from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist


def test_dataset_list(client, db):
    response = client.get(reverse('dataset-list'))
    assert response.status_code == 200


def test_dataset_list_version_filter(client, db):
    response = client.get(reverse('dataset-list') + '?version=20200101')
    assert response.status_code == 200


def test_dataset_list_attribute_filter(client, db):
    response = client.get(reverse('dataset-list') + '?round=round')
    assert response.status_code == 200


def test_dataset_histogram(client, db, attributes):
    for attribute in attributes:
        response = client.get(reverse('dataset-histogram', args=[attribute.identifier]))
        assert response.status_code == 200


def test_dataset_histogram_not_found(client, db, attributes):
    for attribute in attributes:
        response = client.get(reverse('dataset-histogram', args=['wrong']))
        assert response.status_code == 404


def test_dataset_filelist(client, db):
    response = client.get(reverse('dataset-filelist'))
    assert response.status_code == 200


def test_dataset_detail(client, db, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset-detail', args=[dataset.id]))
        try:
            dataset.target
            assert response.status_code == 404
        except ObjectDoesNotExist:
            assert response.status_code == 200


def test_dataset_detail_filelist(client, db, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset-detail-filelist', args=[dataset.id]))
        try:
            dataset.target
            assert response.status_code == 404
        except ObjectDoesNotExist:
            assert response.status_code == 200


def test_file_list(client, db):
    response = client.get(reverse('file-list'))
    assert response.status_code == 200


def test_file_detail(client, db, files):
    for file in files:
        response = client.get(reverse('file-detail', args=[file.id]))
        try:
            file.target
            assert response.status_code == 404
        except ObjectDoesNotExist:
            assert response.status_code == 200


def test_glossary_list(client, db):
    response = client.get(reverse('glossary-list'))
    assert response.status_code == 200
