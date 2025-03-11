from django.urls import reverse


def test_facet_list(db, client):
    response = client.get(reverse('facet-list'))
    assert response.status_code == 200
