import json

from isimip_data.core.tests.utils import MockResponse
from isimip_data.metadata.utils import fetch_glossary, fetch_json

test_data = {'spam': 'eggs'}


def test_fetch_json_url(mocker):
    mocker.patch('isimip_data.metadata.utils.urlopen', MockResponse(read_data=json.dumps(test_data)))
    assert fetch_json('http://example.com') == test_data


def test_fetch_json_url_http_error(mocker):
    mocker.patch('isimip_data.metadata.utils.urlopen', MockResponse(http_error=True))
    assert fetch_json('http://example.com') is None


def test_fetch_json_path(mocker):
    mocker.patch('isimip_data.metadata.utils.open', mocker.mock_open(read_data=json.dumps(test_data)))
    assert fetch_json('/path/to/example') == test_data


def test_fetch_json_path_ioerror(mocker):
    mocked_open = mocker.patch('isimip_data.metadata.utils.open', mocker.mock_open())
    mocked_open.side_effect = IOError
    assert fetch_json('/path/to/example') is None


def test_fetch_json_path_broken(mocker):
    mocker.patch('isimip_data.metadata.utils.open', mocker.mock_open(read_data='{'))
    assert fetch_json('/path/to/example') is None


def test_fetch_glossary():
    glossary = fetch_glossary()
    assert isinstance(glossary, dict)


def test_fetch_glossary_type_update(mocker):
    mocked_fetch_json = mocker.patch('isimip_data.metadata.utils.fetch_json')
    mocked_fetch_json.return_value = []

    assert fetch_glossary() == {}


def test_fetch_glossary_type_error(mocker):
    mocker.patch('isimip_data.metadata.utils.settings', GLOSSARIES=['glossary1.json', 'glossary2.json'])

    mocked_fetch_json = mocker.patch('isimip_data.metadata.utils.fetch_json')
    mocked_fetch_json.side_effect = [
        {
            'terms': {
                'alpha': {
                    'lorem': {}
                }
            }
        },
        {
            'terms': {
                'alpha': {
                    'ipsum': {}
                }
            }
        }
    ]

    assert fetch_glossary() == {
        'alpha': {
            'lorem': {},
            'ipsum': {}
        }
    }


def test_fetch_glossary_attribute_error(mocker):
    mocked_fetch_json = mocker.patch('isimip_data.metadata.utils.fetch_json')
    mocked_fetch_json.return_value = {
        'terms': []
    }

    assert fetch_glossary() == {}
