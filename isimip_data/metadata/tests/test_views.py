from django.urls import reverse

from isimip_data.metadata.models import Dataset, File, Resource


def test_metadata(db, client):
    response = client.get(reverse('metadata'))
    assert response.status_code == 200


def test_metadata_dataset(db, client):
    dataset = Dataset.objects.using('metadata').first()
    url = reverse('metadata') + '?query=' + str(dataset.id)
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == f'/datasets/{dataset.id}/'


def test_metadata_file(db, client):
    file = File.objects.using('metadata').first()
    url = reverse('metadata') + '?query=' + str(file.id)
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == f'/files/{file.id}/'


def test_metadata_file_checksum(db, client):
    file = File.objects.using('metadata').first()
    url = reverse('metadata') + '?query=' + str(file.checksum)
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == f'/files/{file.id}/'


def test_metadata_wrong(db, client):
    url = reverse('metadata') + '?query=wrong'
    response = client.get(url)
    assert response.status_code == 404


def test_dataset_id(db, client):
    dataset = Dataset.objects.using('metadata').filter(target=None).first()
    response = client.get(reverse('dataset', args=[dataset.id]))
    assert response.status_code == 200


def test_dataset_id_target(db, client):
    dataset = Dataset.objects.using('metadata').exclude(target=None).first()
    response = client.get(reverse('dataset', args=[dataset.id]))
    assert response.status_code == 303


# def test_dataset_path(db, client):
#     dataset = Dataset.objects.using('metadata').filter(target=None).first()
#     response = client.get(reverse('dataset', args=[dataset.path]))
#     assert response.status_code == 200


# def test_dataset_path_target(db, client):
#     dataset = Dataset.objects.using('metadata').exclude(target=None).first()
#     response = client.get(reverse('dataset', args=[dataset.path]))
#     assert response.status_code == 303


def test_file_id(db, client):
    file = File.objects.using('metadata').filter(dataset__target=None).first()
    response = client.get(reverse('file', args=[file.id]))
    assert response.status_code == 200


def test_file_id_target(db, client):
    file = File.objects.using('metadata').exclude(dataset__target=None).first()
    response = client.get(reverse('file', args=[file.id]))
    assert response.status_code == 303


# def test_file_path(db, client):
#     file = File.objects.using('metadata').filter(dataset__target=None).first()
#     response = client.get(reverse('file', args=[file.path]))
#     assert response.status_code == 200


# def test_file_path_target(db, client):
#     file = File.objects.using('metadata').exclude(dataset__target=None).first()
#     response = client.get(reverse('file', args=[file.path]))
#     assert response.status_code == 303


def test_identifiers(db, client):
    response = client.get(reverse('identifiers'))
    assert response.status_code == 200


def test_resources(db, client):
    response = client.get(reverse('resources'))
    assert response.status_code == 200


def test_resource(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource', args=[resource.doi]))
    assert response.status_code == 200


def test_resource_bibtex(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource_bibtex', args=[resource.doi]))
    assert response.status_code == 200


def test_resource_json(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource_json', args=[resource.doi]))
    assert response.status_code == 200


def test_resource_xml(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource_xml', args=[resource.doi]))
    assert response.status_code == 200
