import json
import logging
from collections import OrderedDict
from urllib.parse import quote, urlparse
from urllib.request import HTTPError, urlopen

from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)


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
        logger.error('Could not open {} ({})'.format(glossary_location, e))
    except IOError as e:
        logger.error('Could not open {} ({})'.format(glossary_location, e))
    except json.decoder.JSONDecodeError:
        logger.error('Could not decode {}'.format(glossary_location))
    finally:
        return glossary_json


def fetch_glossary():
    glossary = cache.get('glossary')
    if glossary is None:
        glossary = {}
        for location in settings.PROTOCOL_LOCATIONS:
            glossary_location = location.rstrip('/') + '/glossary.json'
            glossary_json = fetch_json(glossary_location)
            if glossary_json is not None:
                try:
                    for identifier, values in glossary_json.get('terms', {}).items():
                        if identifier not in glossary:
                            glossary[identifier] = values
                        else:
                            glossary[identifier].update(values)

                except TypeError:
                    logger.error('TypeError for {}'.format(location))
                except AttributeError:
                    logger.error('AttributeError for {}'.format(location))

        cache.set('glossary', glossary)

    return glossary


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
            pretty_key = key.replace('_', ' ').title()

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
            url += '{}/{}/'.format(quote(key), quote(value))
    return url


def get_terms_of_use():
    return {
        'terms_of_use': settings.TERMS_OF_USE,
        'terms_of_use_url': settings.TERMS_OF_USE_URL
    }


def render_bibtex(resource):
    authors = ' and '.join([creator.get('name') for creator in resource.datacite.get('creators', []) if creator.get('name')])

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
