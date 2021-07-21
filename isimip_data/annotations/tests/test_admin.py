from django.urls import reverse

from isimip_data.annotations.models import Annotation


def test_annotation_add_get(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:annotations_annotation_add')
    response = client.get(url)
    assert response.status_code == 200


def test_annotation_add_post(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:annotations_annotation_add')
    response = client.post(url, {
        'title': 'New Annotation',
        'specifiers_model': 'model',
        'Annotation_figures-TOTAL_FORMS': 0,
        'Annotation_figures-INITIAL_FORMS': 0,
        'Annotation_figures-MIN_NUM_FORMS': 0,
        'Annotation_figures-MAX_NUM_FORMS': 1000,
        'Annotation_figures-__prefix__-id': '',
        'Annotation_figures-__prefix__-annotation': 1,
        'Annotation_figures-__prefix__-figure': '',
        'Annotation_downloads-TOTAL_FORMS': 0,
        'Annotation_downloads-INITIAL_FORMS': 0,
        'Annotation_downloads-MIN_NUM_FORMS': 0,
        'Annotation_downloads-MAX_NUM_FORMS': 1000,
        'Annotation_downloads-__prefix__-id': '',
        'Annotation_downloads-__prefix__-annotation': 1,
        'Annotation_downloads-__prefix__-download': '',
        'Annotation_references-TOTAL_FORMS': 0,
        'Annotation_references-INITIAL_FORMS': 0,
        'Annotation_references-MIN_NUM_FORMS': 0,
        'Annotation_references-MAX_NUM_FORMS': 1000,
        'Annotation_references-__prefix__-id': '',
        'Annotation_references-__prefix__-annotation': 1,
        'Annotation_references-__prefix__-reference': ''
    })
    assert response.status_code == 302
    assert Annotation.objects.get(title='New Annotation').specifiers == {
        'model': ['model']
    }


def test_annotation_change_get(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:annotations_annotation_change', args=[1])
    response = client.get(url)
    assert response.status_code == 200


def test_annotation_change_post(db, client):
    client.login(username='admin', password='admin')

    url = reverse('admin:annotations_annotation_change', args=[1])
    response = client.post(url, {
        'title': 'Annotation',
        'specifiers_model': 'model3',
        'Annotation_figures-TOTAL_FORMS': 0,
        'Annotation_figures-INITIAL_FORMS': 0,
        'Annotation_figures-MIN_NUM_FORMS': 0,
        'Annotation_figures-MAX_NUM_FORMS': 1000,
        'Annotation_figures-__prefix__-id': '',
        'Annotation_figures-__prefix__-annotation': 1,
        'Annotation_figures-__prefix__-figure': '',
        'Annotation_downloads-TOTAL_FORMS': 0,
        'Annotation_downloads-INITIAL_FORMS': 0,
        'Annotation_downloads-MIN_NUM_FORMS': 0,
        'Annotation_downloads-MAX_NUM_FORMS': 1000,
        'Annotation_downloads-__prefix__-id': '',
        'Annotation_downloads-__prefix__-annotation': 1,
        'Annotation_downloads-__prefix__-download': '',
        'Annotation_references-TOTAL_FORMS': 0,
        'Annotation_references-INITIAL_FORMS': 0,
        'Annotation_references-MIN_NUM_FORMS': 0,
        'Annotation_references-MAX_NUM_FORMS': 1000,
        'Annotation_references-__prefix__-id': '',
        'Annotation_references-__prefix__-annotation': 1,
        'Annotation_references-__prefix__-reference': ''
    })
    assert response.status_code == 302
    assert Annotation.objects.get(pk=1).specifiers == {
        'model': ['model3']
    }
