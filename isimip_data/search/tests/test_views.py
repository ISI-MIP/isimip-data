from django.urls import reverse


def test_search(db, client):
    url = reverse('search')
    response = client.get(url)
    assert response.status_code == 200


def test_search_location(db, client):
    url = reverse('search') + '?foo=bar'
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == '/search/foo/bar'
