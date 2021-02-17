import json
from collections import defaultdict
from uuid import UUID

from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from isimip_data.caveats.models import Caveat

from .models import Attribute, Dataset, File, Resource
from .renderers import BibTexRenderer, DataCiteRenderer
from .utils import prettify_attributes


def metadata(request):
    query = request.GET.get('query', '').strip()

    if query:
        # try to get a uuid from the query
        try:
            uuid = UUID(query)
        except ValueError:
            uuid = None

        dataset = Dataset.objects.using('metadata').filter(Q(id=uuid) | Q(path=query)).first()
        if dataset:
            return redirect('dataset', dataset.id)

        file = File.objects.using('metadata').filter(Q(id=uuid) | Q(path=query) | Q(checksum=query)).first()
        if file:
            return redirect('file', file.id)

    return render(request, 'metadata/metadata.html', {
        'example_file': File.objects.using('metadata').first()
    })


def dataset(request, pk=None, path=None):
    if pk is not None:
        obj = get_object_or_404(Dataset.objects.using('metadata'), id=pk)
    elif path is not None:
        obj = get_object_or_404(Dataset.objects.using('metadata'), path=path)
    else:
        raise RuntimeError('Either pk or path need to be provided')

    versions = Dataset.objects.using('metadata').filter(path=obj.path) \
                                                .exclude(id=obj.id) \
                                                .order_by('-version')

    caveats = Caveat.objects.filter(datasets__contains=[obj.id]).public(request.user)

    if versions:
        caveats_versions = Caveat.objects.filter(datasets__contains=list(versions.values_list('id', flat=True)))
    else:
        caveats_versions = None

    return render(request, 'metadata/dataset.html', {
        'dataset': obj,
        'versions': versions,
        'specifiers': prettify_attributes(obj.specifier_list),
        'caveats': caveats,
        'caveats_versions': caveats_versions
    })


def file(request, pk=None, path=None):
    if pk is not None:
        obj = get_object_or_404(File.objects.using('metadata'), id=pk)
    elif path is not None:
        obj = get_object_or_404(File.objects.using('metadata'), path=path)
    else:
        raise RuntimeError('Either pk or path need to be provided')

    versions = File.objects.using('metadata').filter(path=obj.path) \
                                             .exclude(id=obj.id) \
                                             .order_by('-version')

    caveats = Caveat.objects.filter(datasets__contains=[obj.dataset_id]).public(request.user)

    if versions:
        caveats_versions = Caveat.objects.filter(datasets__contains=list(versions.values_list('dataset_id', flat=True)))
    else:
        caveats_versions = None

    return render(request, 'metadata/file.html', {
        'file': obj,
        'versions': versions,
        'specifiers': prettify_attributes(obj.specifier_list),
        'caveats': caveats,
        'caveats_versions': caveats_versions
    })


def resources(request):
    return render(request, 'metadata/resources.html', {
        'resources': Resource.objects.using('metadata').exclude(datacite=None).order_by('paths'),
        'resources_external': Resource.objects.using('metadata').filter(datacite=None).order_by('paths')
    })


def resource(request, doi=None):
    resource = get_object_or_404(Resource.objects.using('metadata'), doi=doi)

    references = defaultdict(list)
    if resource.datacite is not None:
        for identifier in resource.datacite.get('relatedIdentifiers'):
            if identifier.get('relationType') == 'IsDocumentedBy':
                references['IsDocumentedBy'].append(identifier)
            elif identifier.get('relationType') == 'Cites':
                references['Cites'].append(identifier)
            elif identifier.get('relationType') == 'IsDerivedFrom':
                references['IsDerivedFrom'].append(identifier)
            elif identifier.get('relationType') == 'HasPart':
                references['HasPart'].append(identifier)
            else:
                references['Other'].append(identifier)

    dataset_ids = [str(dataset_id) for dataset_id in resource.datasets.values_list('id', flat=True)]
    caveats = Caveat.objects.filter(datasets__contains=dataset_ids).public(request.user)

    return render(request, 'metadata/resource.html', {
        'resource': resource,
        'references': references,
        'caveats': caveats
    })


def resource_bibtex(request, doi=None):
    obj = get_object_or_404(Resource.objects.using('metadata'), doi=doi)
    bibtex = BibTexRenderer().render(obj)
    response = HttpResponse(bibtex, content_type="application/x-bibtex")
    response['Content-Disposition'] = 'filename="{}.bib"'.format(doi)
    return response


def resource_datacite_json(request, doi=None):
    obj = get_object_or_404(Resource.objects.using('metadata'), doi=doi)
    json_string = json.dumps(obj.datacite, indent=2)
    response = HttpResponse(json_string, content_type="application/json")
    response['Content-Disposition'] = 'filename="{}.json"'.format(doi)
    return response


def resource_datacite_xml(request, doi=None):
    obj = get_object_or_404(Resource.objects.using('metadata'), doi=doi)
    xml = DataCiteRenderer().render(obj)
    response = HttpResponse(xml, content_type="application/xml")
    response['Content-Disposition'] = 'filename="{}.xml"'.format(doi)
    return response


def attributes(request):
    attributes_list = []
    for identifier in Attribute.objects.using('metadata').identifiers():
        attributes_list.append((identifier, Dataset.objects.using('metadata').histogram(identifier)))

    return render(request, 'metadata/attributes.html', {
        'attributes': attributes_list
    })
