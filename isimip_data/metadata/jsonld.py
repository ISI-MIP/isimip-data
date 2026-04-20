from .models import Dataset, File, Resource
from .utils import fetch_glossary


def get_jsonld(request, obj):
    if isinstance(obj, Resource):
        data = {
            '@context': 'https://schema.org/',
            '@type': 'Dataset',
            'name': obj.title,
            'identifier': obj.doi_url,
        }

        if obj.datacite:
            data.update(get_jsonld_datacite(obj))

    elif isinstance(obj, Dataset):
        resources = (
            [get_jsonld(request, resource) for resource in obj.resources.order_by('-doi')]
        )

        data = {
            '@context': 'https://schema.org/',
            '@type': 'Dataset',
            'name': get_jsonld_name(obj),
            'description': get_jsonld_description(obj, resources=resources),
            'identifier': request.build_absolute_uri(obj.get_absolute_url())
        }

        if resources:
            data['isPartOf'] = resources

    elif isinstance(obj, File):
        dataset = get_jsonld(request, obj.dataset)

        data = {
            '@context': 'https://schema.org/',
            '@type': 'Dataset',
            'name': get_jsonld_name(obj),
            'description': f'Part of {dataset.get("identifier")}',
            'identifier': request.build_absolute_uri(obj.get_absolute_url()),
            'isPartOf': [dataset]
        }

    else:
        raise RuntimeError(f'get_jsonld is not implemented for {obj}')

    return data


def get_jsonld_name(obj, append_name=True):
    glossary = fetch_glossary()

    parts = []
    for identifier in ['simulation_round', 'product', 'category', 'sector', 'publication']:
        specifier = obj.specifiers.get(identifier)
        if specifier:
            title = glossary.get('identifier', {}).get('specifier', {}).get('title')
            if title:
                if identifier == 'product':
                    title = title.lower().replace('data', obj._meta.model_name)
                if identifier == 'sector':
                    title = f'from the {title.lower()} sector'
                elif identifier == 'category':
                    title = f'({title.lower()})'
                elif identifier == 'publication':
                    title = f'from {title}'

                parts.append(title)

    name = ' '.join(parts)
    if name and append_name:
        name += f': {obj.name}'

    return name


def get_jsonld_description(obj, resources=None):
    if resources:
        return 'Part of ' + ', '.join([resource.get("identifier") for resource in resources])
    else:
        return f'{get_jsonld_name(obj, append_name=False)}. No DOI assigned yet.'


def get_jsonld_datacite(obj):
    return {
        'description': obj.abstract,
        'version': obj.datacite.get('version'),
        'keywords': [
            subject['subject']
            for subject in obj.datacite.get('subjects', [])
            if subject.get('subject')
        ],
        'publisher': {
            '@type': 'Organization',
            'name': obj.datacite.get('publisher')
        },
        'datePublished': obj.publication_date.isoformat(),
        'license': [
            {
                '@type': 'CreativeWork',
                'name': rights.get('rights'),
                'url': rights.get('rights_uri')
            } for rights in obj.rights_list
        ],
        'isAccessibleForFree': True,
        'creator': [
            get_jsonld_datacite_name(creator)
            for creator in obj.datacite.get('creators', [])
        ],
        'contributor': [
            get_jsonld_datacite_name(contributor)
            for contributor in obj.datacite.get('contributors', [])
        ]
    }


def get_jsonld_datacite_name(name):
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
