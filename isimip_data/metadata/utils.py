import json
import logging
import re
from collections import OrderedDict
from urllib.parse import quote, urlparse
from urllib.request import HTTPError, urlopen

from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

search_terms_split_pattern = re.compile(r'[\/\_\-\s]')


def split_query_string(query):
    return search_terms_split_pattern.split(query.strip())


def fetch_json(glossary_location):
    glossary_json = None
    try:
        if urlparse(glossary_location).scheme:
            with urlopen(glossary_location) as response:
                glossary_json = json.loads(response.read())
        else:
            with open(glossary_location) as f:
                glossary_json = json.loads(f.read())

    except HTTPError as e:
        logger.error(f'Could not open {glossary_location} ({e})')
    except OSError as e:
        logger.error(f'Could not open {glossary_location} ({e})')
    except json.decoder.JSONDecodeError:
        logger.error(f'Could not decode {glossary_location}')

    return glossary_json


def fetch_glossary():
    glossary = cache.get('glossary')
    if glossary is None:
        if not isinstance(settings.PROTOCOL_LOCATIONS, list):
            raise RuntimeError('settings.PROTOCOL_LOCATIONS has to be a list')

        glossary = {}
        build_glossary(glossary, settings.PROTOCOL_LOCATIONS)
        cache.set('glossary', glossary)

    return glossary


def build_glossary(glossary, locations):
    for location in locations:
        glossary_location = location.rstrip('/') + '/glossary.json'
        glossary_json = fetch_json(glossary_location)
        if glossary_json is not None:
            try:
                for identifier, identifier_values in glossary_json.get('terms', {}).items():
                    if identifier not in glossary:
                        glossary[identifier] = {}

                    for specifier, specifier_values in identifier_values.items():
                        if specifier not in glossary[identifier]:
                            glossary[identifier][specifier] = {}

                        for key, value in specifier_values.items():
                            if key in settings.METADATA_GLOSSARY_KEYS:
                                if key not in glossary[identifier][specifier]:
                                    glossary[identifier][specifier][key] = value
                                elif isinstance(glossary[identifier][specifier][key], dict) and isinstance(value, dict):
                                    glossary[identifier][specifier][key].update(value)
            except TypeError:
                logger.error(f'TypeError for {location}')
            except AttributeError:
                logger.error(f'AttributeError for {location}')


def prettify_identifiers(identifiers):
    glossary = fetch_glossary()
    pretty = []
    for identifier in identifiers:
        try:
            pretty.append(glossary['identifier'][identifier]['title'])
        except (KeyError, TypeError):
            pretty.append(identifier.replace('_', ' ').title())

    return pretty


def prettify_specifiers(specifiers, identifiers):
    glossary = fetch_glossary()

    pretty = OrderedDict()
    for key, values in [(identifier, specifiers.get(identifier)) for identifier in identifiers]:
        try:
            pretty_key = glossary['identifier'][key]['title']
        except (KeyError, TypeError):
            pretty_key = key.replace('_', ' ')

        pretty_values = []
        if values:
            for value in values:
                try:
                    pretty_values.append(glossary[key][value]['title'])
                except (KeyError, TypeError):
                    pretty_values.append(value)

        pretty[pretty_key] = pretty_values

    return pretty


def merge_identifiers(obj):
    identifiers = obj.identifiers

    for link in obj.links.all():
        for identifier in link.identifiers:
            if identifier not in identifiers:
                identifiers.append(identifier)

    return identifiers


def merge_specifiers(obj):
    specifiers = {key: [value] for key, value in obj.specifiers.items()}

    for link in obj.links.all():
        for key, value in link.specifiers.items():
            if key in specifiers:
                if value not in specifiers[key]:
                    specifiers[key].append(value)
            else:
                specifiers[key] = [value]

    return specifiers


def get_search_url(specifiers, identifiers):
    url = '/search/'
    for key, values in [(identifier, specifiers.get(identifier)) for identifier in identifiers]:
        for value in values:
            url += f'{quote(key)}/{quote(value)}/'
    return url


def get_terms_of_use():
    return {
        'terms_of_use': settings.TERMS_OF_USE,
        'terms_of_use_url': settings.TERMS_OF_USE_URL
    }


def render_bibtex(resource):
    authors = ' and '.join([creator.get('name')
                            for creator in resource.datacite.get('creators', [])
                            if creator.get('name')])

    return '''
@misc{{{doi},
    authors = {{{authors}}},
    year = {{{year}}},
    title = {{{title}}},
    version = {{{version}}},
    publisher = {{{publisher}}},
    doi = {{{doi}}},
    url = {{{doi_url}}}
}}
'''.format(
            authors=authors,
            year=resource.datacite.get('publicationYear'),
            title=resource.title,
            version=resource.major_version,
            publisher=resource.datacite.get('publisher'),
            doi=resource.doi,
            doi_url=resource.doi_url
        ).strip()


def get_json_ld_name(name):
    json_ld_name = {
        '@type': 'Organization' if name.get('nameType') == 'Organizational' else 'Person'
    }

    try:
        json_ld_name['@id'] = name['nameIdentifiers'][0]['nameIdentifiers']
    except (KeyError, IndexError):
        pass

    for key in ['name', 'givenName', 'familyName']:
        if key in name:
            json_ld_name[key] = name[key]

    return json_ld_name
