from django.urls import reverse

from isimip_data.metadata.models import File

dataset_id = 'b9f8fbc2-d164-42a4-8eb4-2297edcee75b'
file_id = 'd147682f-b3e9-4718-b292-80fbbc499d60'


def test_file_list(db, client):
    response = client.get(reverse('file-list'))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 6


def test_file_list_id_filter(db, client):
    response = client.get(reverse('file-list') + f'?id={file_id}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['id'] == file_id


def test_file_list_dataset_filter(db, client):
    response = client.get(reverse('dataset-list') + f'?dataset={dataset_id}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 2


def test_file_list_name_filter(db, client):
    name = 'model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc'

    response = client.get(reverse('file-list') + f'?name={name}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['name'] == name


def test_file_list_path_filter(db, client):
    path = 'round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc'

    response = client.get(reverse('file-list') + f'?path={path}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['path'] == path


def test_file_list_search_filter(db, client):
    response = client.get(reverse('file-list') + '?query=ipsum')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 3
    assert response_data['results'][0]['id'] == file_id


def test_file_list_version_filter(db, client):
    response = client.get(reverse('file-list') + '?version=20200101')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 6


def test_file_list_tree_filter(db, client):
    response = client.get(reverse('file-list') + '?tree=model%2Fipsum')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 3
    assert response_data['results'][0]['id'] == file_id


def test_file_list_identifier_filter(db, client):
    response = client.get(reverse('file-list') + '?alpha=ipsum')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 3
    assert response_data['results'][0]['specifiers']['alpha'] == 'ipsum'


def test_file_list_checksum_filter(db, client):
    checksum = (
        'a6f1e2a0b4b57b1bb2466bd064896cf9b0dba571ef8547b277f20daaa52690e4'
        '906a69310c01f275c4b3c1231a1ae2134bbd55bdf526aefe68abf8ce5e10083e'
    )
    response = client.get(reverse('file-list') + f'?checksum={checksum}')
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['count'] == 1
    assert response_data['results'][0]['id'] == file_id


def test_file_detail(db, client):
    response = client.get(reverse('file-detail', args=[file_id]))
    response_data = response.json()

    assert response.status_code == 200
    assert response_data['id'] == file_id


def test_file_detail_target(db, client):
    file = File.objects.using('metadata').exclude(datasets__target=None).first()
    response = client.get(reverse('file-detail', args=[file.id]))

    assert response.status_code == 404
