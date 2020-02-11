import json
import logging
from urllib.parse import urlparse
from urllib.request import HTTPError, urlopen

from django.conf import settings

logger = logging.getLogger(__name__)


def fetch_json(location):
    glossary_json = None
    try:
        if urlparse(location).scheme:
            with urlopen(location) as response:
                glossary_json = json.loads(response.read())
        else:
            with open(location) as f:
                glossary_json = json.loads(f.read())

    except HTTPError as e:
        logger.error('Could not open {} ({})'.format(location, e))
    except IOError as e:
        logger.error('Could not open {} ({})'.format(location, e))
    except json.decoder.JSONDecodeError:
        logger.error('Could not decode {}'.format(location))
    finally:
        return glossary_json


def fetch_glossary():
    glossary = {}
    locations = settings.GLOSSARIES
    for location in locations:
        glossary_json = fetch_json(location)

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