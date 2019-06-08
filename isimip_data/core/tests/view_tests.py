from django.urls import reverse


def test_home(client):
    response = client.get(reverse('home'))
    assert response.status_code == 200
