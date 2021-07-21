from django.urls import reverse

from isimip_data.metadata.models import Dataset, File, Resource


def test_dataset_changelist(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:metadata_dataset_changelist')
    response = client.get(url)
    assert response.status_code == 200


def test_dataset_change(db, client):
    client.login(username='admin', password='admin')

    dataset = Dataset.objects.using('metadata').first()

    url = reverse('admin:metadata_dataset_change', args=[dataset.id])
    response = client.get(url)
    assert response.status_code == 200


def test_dataset_delete(db, client):
    client.login(username='admin', password='admin')

    dataset = Dataset.objects.using('metadata').first()

    url = reverse('admin:metadata_dataset_delete', args=[dataset.id])
    response = client.get(url)
    assert response.status_code == 403


def test_file_changelist(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:metadata_file_changelist')
    response = client.get(url)
    assert response.status_code == 200


def test_file_change(db, client):
    client.login(username='admin', password='admin')

    file = File.objects.using('metadata').first()

    url = reverse('admin:metadata_file_change', args=[file.id])
    response = client.get(url)
    assert response.status_code == 200


def test_file_delete(db, client):
    client.login(username='admin', password='admin')

    file = File.objects.using('metadata').first()

    url = reverse('admin:metadata_file_delete', args=[file.id])
    response = client.get(url)
    assert response.status_code == 403


def test_resource_changelist(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:metadata_resource_changelist')
    response = client.get(url)
    assert response.status_code == 200


def test_resource_change(db, client):
    client.login(username='admin', password='admin')

    resource = Resource.objects.using('metadata').first()

    url = reverse('admin:metadata_resource_change', args=[resource.id])
    response = client.get(url)
    assert response.status_code == 200


def test_resource_delete(db, client):
    client.login(username='admin', password='admin')

    resource = Resource.objects.using('metadata').first()

    url = reverse('admin:metadata_resource_delete', args=[resource.id])
    response = client.get(url)
    assert response.status_code == 403
