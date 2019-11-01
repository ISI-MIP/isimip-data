from django.urls import reverse


def test_dataset_list(client, db):
    response = client.get(reverse('dataset-list'))
    assert response.status_code == 200


def test_dataset_histogram(client, db, attributes):
    for attribute in attributes:
        response = client.get(reverse('dataset-histogram', args=[attribute.key]))
        assert response.status_code == 200


def test_dataset_filelist(client, db):
    response = client.get(reverse('dataset-filelist'))
    assert response.status_code == 200


def test_dataset_wget(client, db):
    response = client.get(reverse('dataset-wget'))
    assert response.status_code == 200


def test_dataset_detail(client, db, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset-detail', args=[dataset.id]))
        assert response.status_code == 200


def test_dataset_detail_filelist(client, db, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset-detail-filelist', args=[dataset.id]))
        assert response.status_code == 200


def test_dataset_detail_wget(client, db, datasets):
    for dataset in datasets:
        response = client.get(reverse('dataset-detail-wget', args=[dataset.id]))
        assert response.status_code == 200


def test_file_list(client, db):
    response = client.get(reverse('file-list'))
    assert response.status_code == 200


def test_file_detail(client, db, files):
    for file in files:
        response = client.get(reverse('file-detail', args=[file.id]))
        assert response.status_code == 200
