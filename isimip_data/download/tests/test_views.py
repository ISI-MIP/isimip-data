from django.urls import reverse


def test_download(client):
    response = client.get(reverse('download'))
    assert response.status_code == 200
