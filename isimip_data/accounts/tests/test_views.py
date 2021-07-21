import pytest

from django.urls import reverse
from django.contrib.auth.models import User


def test_profile_update_get(db, client):
    client.login(username='user', password='user')

    url = reverse('profile_update')
    response = client.get(url)
    assert response.status_code == 200


def test_profile_update_get_redirect(db, client):
    url = reverse('profile_update')
    response = client.get(url)
    assert response.status_code == 302


def test_profile_update_post(db, client):
    client.login(username='user', password='user')

    url = reverse('profile_update')
    response = client.post(url, {
        'first_name': 'Tommy',
        'last_name': 'Test',
    })
    assert response.status_code == 200

    user = User.objects.get(username='user')
    assert user.first_name == 'Tommy'
    assert user.last_name == 'Test'


def test_profile_update_post_redirect(db, client):
    url = reverse('profile_update')
    response = client.post(url, {
        'first_name': 'Tommy',
        'last_name': 'Test',
    })
    assert response.status_code == 302

    user = User.objects.get(username='user')
    assert user.first_name == 'Ulf'
    assert user.last_name == 'User'


def test_profile_delete_get(db, client):
    client.login(username='user', password='user')

    url = reverse('profile_delete')
    response = client.get(url)
    assert response.status_code == 200


def test_profile_delete_get_redirect(db, client):
    url = reverse('profile_delete')
    response = client.get(url)
    assert response.status_code == 302


def test_profile_delete_post(db, client):
    client.login(username='user', password='user')

    url = reverse('profile_delete')
    response = client.post(url, {
        'email': 'user@example.com',
        'password': 'user',
        'consent': True
    })
    assert response.status_code == 302

    with pytest.raises(User.DoesNotExist):
        User.objects.get(username='user')


def test_profile_delete_post_redirect(db, client):
    url = reverse('profile_delete')
    response = client.post(url, {})
    assert response.status_code == 302

    assert User.objects.get(username='user')


def test_profile_delete_success(db, client):
    url = reverse('profile_delete_success')
    response = client.post(url, {})
    assert response.status_code == 200
