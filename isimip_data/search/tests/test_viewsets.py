from django.urls import reverse


def test_facet_list(client, db):
    response = client.get(reverse('facet-list'))
    assert response.status_code == 200


def test_facet_detail(client, db, facets):
    for facet in facets:
        response = client.get(reverse('facet-detail', args=[facet.id]))
        assert response.status_code == 200
