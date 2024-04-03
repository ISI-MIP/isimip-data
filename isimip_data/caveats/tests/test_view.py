from django.urls import reverse


def test_caveats(db, client):
    url = reverse('caveats')
    response = client.get(url)
    assert response.status_code == 200


def test_caveats_user(db, client):
    client.login(username='user', password='user')

    url = reverse('caveats')
    response = client.get(url)
    assert response.status_code == 200


def test_caveats_admin(db, client):
    client.login(username='admin', password='admin')

    url = reverse('caveats')
    response = client.get(url)
    assert response.status_code == 200


def test_caveat(db, client):
    url = reverse('caveat', args=[1])
    response = client.get(url)
    assert response.status_code == 200
