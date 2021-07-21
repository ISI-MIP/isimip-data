from django.urls import reverse


def test_download(db, client):
    response = client.get(reverse('download'))
    assert response.status_code == 200
