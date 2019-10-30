from django.urls import reverse


def test_search(client):
    response = client.get(reverse('search'))
    assert response.status_code == 200
