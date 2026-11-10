from django.urls import reverse


def test_country_list(db, client):
    response = client.get(reverse('country-list'))
    assert response.status_code == 200
