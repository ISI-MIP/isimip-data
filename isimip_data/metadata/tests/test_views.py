from django.urls import reverse


def test_datasets(client, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset', args=[dataset.id]))
        assert response.status_code == 200


def test_files(client, files):
    for file in files:
        response = client.get(reverse('file', args=[file.id]))
        assert response.status_code == 200
