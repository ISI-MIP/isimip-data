from django.urls import reverse

from isimip_data.metadata.models import Dataset, File, Identifier, Resource


def test_dataset_list(db, client):
    response = client.get(reverse('dataset-list'))
    assert response.status_code == 200


def test_dataset_list_version_filter(db, client):
    response = client.get(reverse('dataset-list') + '?version=20200101')
    assert response.status_code == 200


def test_dataset_list_identifier_filter(db, client):
    response = client.get(reverse('dataset-list') + '?round=round')
    assert response.status_code == 200


def test_dataset_histogram(db, client):
    identifier = Identifier.objects.using('metadata').first()
    response = client.get(reverse('dataset-histogram', args=[identifier.identifier]))
    assert response.status_code == 200


def test_dataset_histogram_not_found(db, client):
    response = client.get(reverse('dataset-histogram', args=['wrong']))
    assert response.status_code == 404


def test_dataset_filelist(db, client):
    response = client.get(reverse('dataset-filelist'))
    assert response.status_code == 200


def test_dataset_detail(db, client):
    dataset = Dataset.objects.using('metadata').filter(target=None).first()
    response = client.get(reverse('dataset-detail', args=[dataset.id]))
    assert response.status_code == 200


def test_dataset_detail_target(db, client):
    dataset = Dataset.objects.using('metadata').exclude(target=None).first()
    response = client.get(reverse('dataset-detail', args=[dataset.id]))
    assert response.status_code == 404


def test_dataset_detail_filelist(db, client):
    dataset = Dataset.objects.using('metadata').filter(target=None).first()
    response = client.get(reverse('dataset-detail-filelist', args=[dataset.id]))
    assert response.status_code == 200


def test_dataset_detail_filelist_target(db, client):
    dataset = Dataset.objects.using('metadata').exclude(target=None).first()
    response = client.get(reverse('dataset-detail-filelist', args=[dataset.id]))
    assert response.status_code == 404


def test_file_list(db, client):
    response = client.get(reverse('file-list'))
    assert response.status_code == 200


def test_file_detail(db, client):
    file = File.objects.using('metadata').filter(dataset__target=None).first()
    response = client.get(reverse('file-detail', args=[file.id]))
    assert response.status_code == 200


def test_file_detail_target(db, client):
    file = File.objects.using('metadata').exclude(dataset__target=None).first()
    response = client.get(reverse('file-detail', args=[file.id]))
    assert response.status_code == 404


def test_resource_list(db, client):
    response = client.get(reverse('resource-list'))
    assert response.status_code == 200


def test_resource_detail(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource-detail', args=[resource.id]))
    assert response.status_code == 200


def test_resource_detail_filelist(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource-detail-filelist', args=[resource.id]))
    assert response.status_code == 200


def test_tree_list(db, client):
    response = client.get(reverse('tree-list') + '?tree=model/ipsum')
    assert response.status_code == 200


def test_tree_list_not_found(db, client):
    response = client.get(reverse('tree-list') + '?tree=foo/bar/baz')
    assert response.status_code == 404


def test_glossary_list(db, client):
    response = client.get(reverse('glossary-list'))
    assert response.status_code == 200
