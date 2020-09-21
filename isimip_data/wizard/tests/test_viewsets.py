# import pytest
# from django.urls import reverse
# from isimip_data.wizard.models import Layer

# @pytest.fixture
# def layers(db):
#     return Layer.objects.all()


# def test_layer_list(client, db):
#     response = client.get(reverse('layer-list'))
#     assert response.status_code == 200


# def test_layer_wizard(client, db):
#     response = client.get(reverse('layer-wizard'))
#     assert response.status_code == 200


# def test_layer_wizard_layers(client, db, layers):
#     for layer in layers:
#         response = client.get(reverse('layer-wizard'))
#         assert response.status_code == 200


# def test_layer_detail(client, db, layers):
#     for layer in layers:
#         response = client.get(reverse('layer-detail', args=[layer.id]))
#         assert response.status_code == 200
