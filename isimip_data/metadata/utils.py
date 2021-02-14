import json
import logging
from collections import OrderedDict
from urllib.parse import urlparse
from urllib.request import HTTPError, urlopen

from django.conf import settings

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
    glossary = {}
    for location in settings.PROTOCOL_LOCATIONS:
        glossary_location = location.rstrip('/') + '/glossary.json'
        glossary_json = fetch_json(glossary_location)

        if glossary_json is not None:
            try:
                for identifier, values in glossary_json['terms'].items():
                    if identifier not in glossary:
                        glossary[identifier] = values
                    else:
                        glossary[identifier].update(values)

            except TypeError:
                logger.error('TypeError for {}'.format(location))
            except AttributeError:
                logger.error('AttributeError for {}'.format(location))

    return glossary


def prettify_attributes(attribute_list):
    glossary = fetch_glossary()

    pretty = OrderedDict()
    for key, value in attribute_list:
        try:
            pretty_value = glossary[key][value]['title']
        except (KeyError, TypeError):
            pretty_value = value

        pretty[key.replace('_', ' ').title()] = pretty_value

    return pretty


def prettify_attributes_dict(attribute_dict):
    glossary = fetch_glossary()

    pretty = OrderedDict()
    for key, values in attribute_dict.items():
        pretty_values = []
        for value in values:
            try:
                pretty_value = glossary[key][value]['title']
            except (KeyError, TypeError):
                pretty_value = value
            pretty_values.append(pretty_value)

        pretty[key.replace('_', ' ').title()] = pretty_values

    return pretty


def get_terms_of_use():
    return {
        'terms_of_use': settings.TERMS_OF_USE,
        'terms_of_use_url': settings.TERMS_OF_USE_URL
    }
