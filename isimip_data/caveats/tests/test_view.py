from django.urls import reverse


def test_caveats(db, client):
    url = reverse('issues_and_notes')
    response = client.get(url)
    assert response.status_code == 200


def test_caveats_legacy(db, client):
    url = reverse('caveats')
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == '/issues-and-notes/'


def test_issue_user(db, client):
    client.login(username='user', password='user')

    url = reverse('issue', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_issue_admin(db, client):
    client.login(username='admin', password='admin')

    url = reverse('issue', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_caveat_legacy(db, client):
    client.login(username='user', password='user')

    url = reverse('caveat', args=[1])
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == '/issues/1/'
