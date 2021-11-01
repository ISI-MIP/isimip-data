from django.urls import reverse


def test_indicators(db, client):
    response = client.get(reverse('indicators'))
    assert response.status_code == 200


def test_indicator(db, client):
    response = client.get(reverse('indicator', args=[1]))
    assert response.status_code == 200
