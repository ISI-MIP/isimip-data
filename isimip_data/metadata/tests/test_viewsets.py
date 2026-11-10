from django.urls import reverse


def test_tree_list(db, client):
    response = client.get(reverse('tree-list') + '?tree=model/ipsum')
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 1


def test_tree_list_not_found(db, client):
    response = client.get(reverse('tree-list') + '?tree=foo/bar/baz')

    assert response.status_code == 404


def test_identifier_list(db, client):
    response = client.get(reverse('identifier-list'))
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) > 0


def test_glossary_list(db, client):
    response = client.get(reverse('glossary-list'))
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) > 0


def test_id_create(db, client):
    isimip_id = '0ba89c4b-ffc8-4605-994d-b82a0b310bb4'
    response = client.post(reverse('id-list'), [isimip_id], content_type='application/json')
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 0


def test_id_create_found(db, client):
    isimip_id = 'b9f8fbc2-d164-42a4-8eb4-2297edcee75b'
    response = client.post(reverse('id-list'), [isimip_id], content_type='application/json')
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 1


def test_id_create_empty(db, client):
    response = client.post(reverse('id-list'), content_type='application/json')

    assert response.status_code == 400


def test_checksum_create(db, client):
    checksum = (
        'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce'
        '47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
    )
    response = client.post(reverse('checksum-list'), [checksum], content_type='application/json')
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 0


def test_checksum_create_found(db, client):
    checksum = (
        'a6f1e2a0b4b57b1bb2466bd064896cf9b0dba571ef8547b277f20daaa52690e4'
        '906a69310c01f275c4b3c1231a1ae2134bbd55bdf526aefe68abf8ce5e10083e'
    )
    response = client.post(reverse('checksum-list'), [checksum], content_type='application/json')
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 2


def test_checksum_create_empty(db, client):
    response = client.post(reverse('checksum-list'), content_type='application/json')

    assert response.status_code == 400
