import io
import json

from django.urls import reverse

from isimip_data.indicators.models import IndicatorValue


def test_indicator_change(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:indicators_indicator_change', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_indicator_upload_get(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:indicators_indicator_upload', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_indicator_upload_post(db, client):
    client.login(username='admin', password='admin')
    values_count = IndicatorValue.objects.count()

    data = [
        {
            'round': 'test-round',
            'alpha': 'ipsum'
        }
    ]

    url = reverse('admin:indicators_indicator_upload', args=[1])
    with io.StringIO(json.dumps(data)) as fp:
        response = client.post(url, {
            '_send': True,
            'file': fp
        })
    assert response.status_code == 302
    assert response.url == reverse('admin:indicators_indicator_change', args=[1])
    assert values_count + 1 == IndicatorValue.objects.count()


def test_indicator_upload_post_error(db, client):
    client.login(username='admin', password='admin')
    values_count = IndicatorValue.objects.count()

    url = reverse('admin:indicators_indicator_upload', args=[1])
    response = client.post(url, {
        '_send': True
    })
    assert response.status_code == 200
    assert b'<ul class="errorlist"><li>This field is required.</li>' in response.content
    assert values_count == IndicatorValue.objects.count()


def test_indicator_upload_error_list(db, client):
    client.login(username='admin', password='admin')
    values_count = IndicatorValue.objects.count()

    data = {
        'round': 'test-round',
        'alpha': 'ipsum'
    }

    url = reverse('admin:indicators_indicator_upload', args=[1])
    with io.StringIO(json.dumps(data)) as fp:
        response = client.post(url, {
            '_send': True,
            'file': fp
        })
    assert response.status_code == 302
    assert response.url == reverse('admin:indicators_indicator_change', args=[1])
    assert values_count == IndicatorValue.objects.count()


def test_indicator_upload_post_back(db, client):
    client.login(username='admin', password='admin')
    values_count = IndicatorValue.objects.count()

    url = reverse('admin:indicators_indicator_upload', args=[1])
    response = client.post(url, {
        '_back': True
    })
    assert response.status_code == 302
    assert response.url == reverse('admin:indicators_indicator_change', args=[1])
    assert values_count == IndicatorValue.objects.count()


def test_indicator_value_change(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:indicators_indicatorvalue_change', args=[1])
    response = client.get(url)
    assert response.status_code == 200
