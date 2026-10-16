from django.urls import reverse


def test_caveat_list(db, client):
    response = client.get(reverse('caveat-list'))
    assert response.status_code == 200


def test_caveat_detail(db, client):
    response = client.get(reverse('caveat-detail', args=[1]))
    assert response.status_code == 200


def test_caveat_detail_datasets(db, client):
    response = client.get(reverse('caveat-detail-datasets', args=[1]))
    assert response.status_code == 200


def test_caveat_detail_files(db, client):
    response = client.get(reverse('caveat-detail-files', args=[1]))
    assert response.status_code == 200


def test_caveat_detail_filelist(db, client):
    response = client.get(reverse('caveat-detail-filelist', args=[1]))
    assert response.status_code == 200


def test_category_list(db, client):
    response = client.get(reverse('category-list'))
    assert response.status_code == 200


def test_severity_list(db, client):
    response = client.get(reverse('severity-list'))
    assert response.status_code == 200


def test_status_list(db, client):
    response = client.get(reverse('status-list'))
    assert response.status_code == 200
