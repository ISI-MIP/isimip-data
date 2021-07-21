from django.contrib.auth.models import User
from django.urls import reverse

from isimip_data.caveats.models import Caveat, Comment
from isimip_data.metadata.models import Dataset


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


def test_caveat_subscribe(db, client):
    client.login(username='user', password='user')

    caveat = Caveat.objects.get(pk=1)
    caveat.subscribers.clear()

    url = reverse('caveat_subscribe', args=[1])
    response = client.get(url)
    assert response.status_code == 302
    assert Caveat.objects.get(pk=1).subscribers.filter(username='user').exists()


def test_caveat_subscribe_login(db, client):
    caveat = Caveat.objects.get(pk=1)
    caveat.subscribers.clear()

    url = reverse('caveat_subscribe', args=[1])
    response = client.get(url)
    assert response.status_code == 302
    assert not Caveat.objects.get(pk=1).subscribers.filter(username='user').exists()
    assert response.url == '/account/login/?next=/caveats/1/subscribe/'


def test_caveat_unsubscribe(db, client):
    client.login(username='user', password='user')

    caveat = Caveat.objects.get(pk=1)
    caveat.subscribers.set([User.objects.get(username='user')])

    url = reverse('caveat_unsubscribe', args=[1])
    response = client.get(url)
    assert response.status_code == 302
    assert not Caveat.objects.get(pk=1).subscribers.filter(username='user').exists()


def test_caveat_unsubscribe_login(db, client):
    caveat = Caveat.objects.get(pk=1)
    caveat.subscribers.set([User.objects.get(username='user')])

    url = reverse('caveat_unsubscribe', args=[1])
    response = client.get(url)
    assert response.status_code == 302
    assert Caveat.objects.get(pk=1).subscribers.filter(username='user').exists()
    assert response.url == '/account/login/?next=/caveats/1/unsubscribe/'


def test_caveat_create_get(db, client):
    client.login(username='user', password='user')

    url = reverse('caveat_create')
    response = client.get(url)
    assert response.status_code == 200


def test_caveat_create_get_login(db, client):
    url = reverse('caveat_create')
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == '/account/login/?next=/caveats/create/'


def test_caveat_create_get_referrer(db, client):
    client.login(username='user', password='user')

    dataset = Dataset.objects.using('metadata').first()
    referer = dataset.get_absolute_url()

    url = reverse('caveat_create')
    response = client.get(url, HTTP_REFERER=referer)
    assert response.status_code == 200


def test_caveat_create_get_referrer_not_found(db, client):
    client.login(username='user', password='user')

    url = reverse('caveat_create')
    response = client.get(url, HTTP_REFERER='/wrong')
    assert response.status_code == 404


def test_caveat_create_post(db, client):
    client.login(username='user', password='user')

    url = reverse('caveat_create')
    response = client.post(url, {
        'title': 'Title',
        'description': 'Description'
    })
    assert response.status_code == 302
    assert response.url.startswith('/caveats/')
    assert Caveat.objects.filter(title='Title', description='Description').exists()


def test_caveat_create_post_dataset(db, client):
    client.login(username='user', password='user')

    dataset = Dataset.objects.using('metadata').first()

    url = reverse('caveat_create')
    response = client.post(url, {
        'title': 'Title',
        'description': 'Description',
        'dataset_id': dataset.id
    })
    assert response.status_code == 302
    assert response.url.startswith('/caveats/')
    assert Caveat.objects.filter(title='Title', description='Description').exists()


def test_caveat_create_post_dataset_not_found(db, client):
    client.login(username='user', password='user')

    url = reverse('caveat_create')
    response = client.post(url, {
        'title': 'Title',
        'description': 'Description',
        'dataset_id': '21689f65-51be-49f2-b9bd-2bc204fb8940'
    })
    assert response.status_code == 302
    assert response.url.startswith('/caveats/')
    assert Caveat.objects.filter(title='Title', description='Description').exists()


def test_caveat_create_post_login(db, client):
    url = reverse('caveat_create')
    response = client.post(url, {
        'title': 'Title',
        'description': 'Description'
    })
    assert response.status_code == 302
    assert response.url == '/account/login/?next=/caveats/create/'
    assert not Caveat.objects.filter(title='Title', description='Description').exists()


def test_comment_create_get(db, client):
    client.login(username='user', password='user')

    url = reverse('comment_create')
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == '/caveats/'


def test_comment_create_get_login(db, client):
    url = reverse('comment_create')
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == '/account/login/?next=/caveats/comments/create/'


def test_comment_create_post(db, client):
    client.login(username='user', password='user')

    url = reverse('comment_create')
    response = client.post(url, {
        'caveat_id': 1,
        'text': 'Text'
    })
    assert response.status_code == 302
    assert response.url.startswith('/caveats/')
    assert Comment.objects.filter(text='Text').exists()


def test_comment_create_post_bad_request(db, client):
    client.login(username='user', password='user')

    url = reverse('comment_create')
    response = client.post(url, {
        'text': 'Text'
    })
    assert response.status_code == 400
    assert not Comment.objects.filter(text='Text').exists()


def test_comment_create_post_login(db, client):
    url = reverse('comment_create')
    response = client.post(url, {
        'caveat_id': 1,
        'text': 'Text'
    })
    assert response.status_code == 302
    assert response.url.startswith('/account/login/?next=/caveats/comments/create/')
    assert not Comment.objects.filter(text='Text').exists()


def test_subscriptions(db, client):
    client.login(username='user', password='user')

    url = reverse('subscriptions')
    response = client.get(url)
    assert response.status_code == 200


def test_subscriptions_login(db, client):
    url = reverse('subscriptions')
    response = client.get(url)
    assert response.status_code == 302
    assert response.url == '/account/login/?next=/subscriptions/'
