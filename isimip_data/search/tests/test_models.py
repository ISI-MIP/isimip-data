from isimip_data.search.models import Facet


def test_layer(db, client):
    facet = Facet.objects.first()
    assert str(facet) == facet.title
