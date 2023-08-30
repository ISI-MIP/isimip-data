from django.conf import settings
from django.core import mail
from django.urls import reverse

from isimip_data.caveats.models import Caveat, Comment


def test_annotation_add_get(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_caveat_add')
    response = client.get(url)
    assert response.status_code == 200


def test_annotation_add_post(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_caveat_add')
    response = client.post(url, {
        'title': 'New Caveat',
        'description': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
        'creator': 1,
        'severity': 'low',
        'status': 'new',
        'specifiers_model': 'model',
        'Caveat_figures-TOTAL_FORMS': 0,
        'Caveat_figures-INITIAL_FORMS': 0,
        'Caveat_figures-MIN_NUM_FORMS': 0,
        'Caveat_figures-MAX_NUM_FORMS': 1000,
        'Caveat_figures-__prefix__-id': '',
        'Caveat_figures-__prefix__-caveat': '',
        'Caveat_figures-__prefix__-figure': '',
        'Caveat_downloads-TOTAL_FORMS': 0,
        'Caveat_downloads-INITIAL_FORMS': 0,
        'Caveat_downloads-MIN_NUM_FORMS': 0,
        'Caveat_downloads-MAX_NUM_FORMS': 1000,
        'Caveat_downloads-__prefix__-id': '',
        'Caveat_downloads-__prefix__-caveat': '',
        'Caveat_downloads-__prefix__-download': ''
    })
    assert response.status_code == 302
    assert Caveat.objects.get(title='New Caveat').specifiers == {
        'model': ['model']
    }


def test_annotation_change_get(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_caveat_change', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_annotation_change_post(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_caveat_change', args=[1])
    response = client.post(url, {
        'title': 'Caveat',
        'description': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
        'creator': 1,
        'severity': 'low',
        'status': 'new',
        'specifiers_model': 'model3',
        'Caveat_figures-TOTAL_FORMS': 0,
        'Caveat_figures-INITIAL_FORMS': 0,
        'Caveat_figures-MIN_NUM_FORMS': 0,
        'Caveat_figures-MAX_NUM_FORMS': 1000,
        'Caveat_figures-__prefix__-id': '',
        'Caveat_figures-__prefix__-caveat': '',
        'Caveat_figures-__prefix__-figure': '',
        'Caveat_downloads-TOTAL_FORMS': 0,
        'Caveat_downloads-INITIAL_FORMS': 0,
        'Caveat_downloads-MIN_NUM_FORMS': 0,
        'Caveat_downloads-MAX_NUM_FORMS': 1000,
        'Caveat_downloads-__prefix__-id': '',
        'Caveat_downloads-__prefix__-caveat': '',
        'Caveat_downloads-__prefix__-download': ''
    })
    assert response.status_code == 302
    assert Caveat.objects.get(pk=1).specifiers == {
        'model': ['model3']
    }


def test_caveat_add_get(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_caveat_change', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_caveat_send_get(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_caveat_send', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_caveat_send_post(db, client):
    client.login(username='admin', password='admin')

    caveat = Caveat.objects.get(pk=1)
    caveat.email = False
    caveat.save()

    url = reverse('admin:caveats_caveat_send', args=[1])
    response = client.post(url, {
        'subject': 'Subject',
        'message': 'Message',
        'recipients': 'mail@example.com\nmail2@example.com',
        '_send': 'Send email'
    })
    assert response.status_code == 302

    assert len(mail.outbox) == 2
    assert mail.outbox[0].subject == 'Subject'
    assert mail.outbox[0].body == 'Message'
    assert mail.outbox[0].from_email == settings.DEFAULT_FROM_EMAIL
    assert mail.outbox[0].to == ['mail@example.com']
    assert mail.outbox[1].to == ['mail2@example.com']
    assert mail.outbox[0].cc == []
    assert mail.outbox[0].bcc == []
    assert mail.outbox[0].attachments == []


def test_caveat_send_post_error(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_caveat_send', args=[1])
    response = client.post(url, {
        'subject': 'Subject',
        'message': 'Message',
        'recipients': 'mail@example.com\nmail2@example.com',
        '_send': 'Send email'
    })
    assert response.status_code == 200
    assert b'No email can been send, since the email flag was set before.' in response.content
    assert len(mail.outbox) == 0


def test_caveat_send_post_back(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_caveat_send', args=[1])
    response = client.post(url, {
        'subject': 'Subject',
        'message': 'Message',
        'recipients': 'mail@example.com\nmail2@example.com',
        '_back': 'Back'
    })
    assert response.status_code == 302
    assert len(mail.outbox) == 0


def test_comment_send_get(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_comment_send', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_comment_send_post(db, client):
    client.login(username='admin', password='admin')

    comment = Comment.objects.get(pk=1)
    comment.email = False
    comment.save()

    url = reverse('admin:caveats_comment_send', args=[1])
    response = client.post(url, {
        'subject': 'Subject',
        'message': 'Message',
        'recipients': 'mail@example.com\nmail2@example.com',
        '_send': 'Send email'
    })
    assert response.status_code == 302

    assert len(mail.outbox) == 2
    assert mail.outbox[0].subject == 'Subject'
    assert mail.outbox[0].body == 'Message'
    assert mail.outbox[0].from_email == settings.DEFAULT_FROM_EMAIL
    assert mail.outbox[0].to == ['mail@example.com']
    assert mail.outbox[1].to == ['mail2@example.com']
    assert mail.outbox[0].cc == []
    assert mail.outbox[0].bcc == []
    assert mail.outbox[0].attachments == []


def test_comment_send_post_error(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_comment_send', args=[1])
    response = client.post(url, {
        'subject': 'Subject',
        'message': 'Message',
        'recipients': 'mail@example.com\nmail2@example.com',
        '_send': 'Send email'
    })
    assert response.status_code == 200
    assert b'No email can been send, since the email flag was set before.' in response.content
    assert len(mail.outbox) == 0


def test_comment_send_post_back(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:caveats_comment_send', args=[1])
    response = client.post(url, {
        'subject': 'Subject',
        'message': 'Message',
        'recipients': 'mail@example.com\nmail2@example.com',
        '_back': 'Back'
    })
    assert response.status_code == 302
    assert len(mail.outbox) == 0
