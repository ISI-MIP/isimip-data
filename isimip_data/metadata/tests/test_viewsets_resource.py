from django.urls import reverse

from isimip_data.metadata.models import Resource

resource_id = '602f6381-d46f-4b71-b8d9-126355bc2ac9'


def test_resource_list(db, client):
    response = client.get(reverse('resource-list'))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1


def test_resource_list_id_filter(db, client):
    response = client.get(reverse('resource-list') + f'?id={resource_id}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['id'] == resource_id


def test_resource_index(db, client):
    response = client.get(reverse('resource-index'))
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 1
    assert response_data[0]['id'] == resource_id


def test_resource_detail(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource-detail', args=[resource.id]))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['id'] == resource_id


def test_resource_detail_datasets(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource-detail-datasets', args=[resource.id]))

    assert response.status_code == 200
    assert response.content


def test_resource_detail_files(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource-detail-files', args=[resource.id]))

    assert response.status_code == 200
    assert response.content


def test_resource_detail_filelist(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource-detail-filelist', args=[resource.id]))

    assert response.status_code == 200
    assert response.content


def test_resource_detail_manifest(db, client):
    resource = Resource.objects.using('metadata').first()
    response = client.get(reverse('resource-detail-manifest', args=[resource.id]))

    assert response.status_code == 200
    assert response.content
