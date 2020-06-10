from django.urls import reverse


def test_settings_list(client, db):
    response = client.get(reverse('setting-list'))
    assert response.status_code == 200
