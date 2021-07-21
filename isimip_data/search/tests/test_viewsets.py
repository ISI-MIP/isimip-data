from django.urls import reverse

from isimip_data.search.models import Facet


def test_facet_list(db, client):
    response = client.get(reverse('facet-list'))
    assert response.status_code == 200


def test_facet_detail(db, client):
    facet = Facet.objects.first()
    response = client.get(reverse('facet-detail', args=[facet.id]))
    assert response.status_code == 200
