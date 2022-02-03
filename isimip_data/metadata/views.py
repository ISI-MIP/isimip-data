import json
from collections import defaultdict
from uuid import UUID

from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render, reverse

from isimip_data.annotations.models import Download, Figure, Reference
from isimip_data.core.utils import get_file_base_url
from isimip_data.caveats.models import Caveat

from .models import Attribute, Dataset, File, Resource
from .renderers import BibTexRenderer, DataCiteRenderer


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
        'title': 'Metadata',
        'example_file': File.objects.using('metadata').first()
    })


def dataset(request, pk=None, path=None):
    queryset = Dataset.objects.using('metadata').prefetch_related('files', 'links')

    if pk is not None:
        obj = get_object_or_404(queryset, id=pk)
    elif path is not None:
        obj = get_object_or_404(queryset, path=path)
    else:
        raise RuntimeError('Either pk or path need to be provided')

    try:
        return HttpResponseRedirect(reverse('dataset', args=[str(obj.target.id)]), status=303)
    except Dataset.DoesNotExist:
        pass

    versions = Dataset.objects.using('metadata').filter(path=obj.path) \
                                                .order_by('-version')

    caveats = Caveat.objects.filter(datasets__contains=[obj.id]).public(request.user)

    if versions:
        caveats_datasets = list(versions.exclude(id=obj.id).values_list('id', flat=True))
        caveats_versions = Caveat.objects.filter(datasets__overlap=caveats_datasets)
    else:
        caveats_versions = None

    return render(request, 'metadata/dataset.html', {
        'title': 'Dataset {}'.format(obj.name),
        'dataset': obj,
        'versions': versions,
        'public_version': versions.exclude(id=obj.id).filter(public=True).first(),
        'figures': Figure.objects.filter(annotations__datasets__contains=[obj.id]),
        'downloads': Download.objects.filter(annotations__datasets__contains=[obj.id]),
        'references': Reference.objects.filter(annotations__datasets__contains=[obj.id]),
        'caveats': caveats,
        'caveats_versions': caveats_versions
    })


def file(request, pk=None, path=None):
    queryset = File.objects.using('metadata').prefetch_related('links')

    if pk is not None:
        obj = get_object_or_404(queryset, id=pk)
    elif path is not None:
        obj = get_object_or_404(queryset, path=path)
    else:
        raise RuntimeError('Either pk or path need to be provided')

    try:
        return HttpResponseRedirect(reverse('file', args=[str(obj.target.id)]), status=303)
    except File.DoesNotExist:
        pass

    versions = File.objects.using('metadata').filter(path=obj.path).order_by('-version')

    caveats = Caveat.objects.filter(datasets__overlap=[obj.dataset_id]).public(request.user)

    if versions:
        caveats_datasets = list(versions.exclude(id=obj.id).values_list('dataset_id', flat=True))
        caveats_versions = Caveat.objects.filter(datasets__overlap=caveats_datasets)
    else:
        caveats_versions = None

    return render(request, 'metadata/file.html', {
        'title': 'File {}'.format(obj.name),
        'file': obj,
        'file_base_url': get_file_base_url(request),
        'parents': [obj.dataset],
        'versions': versions,
        'public_version': versions.exclude(id=obj.id).filter(dataset__public=True).first(),
        'caveats': caveats,
        'caveats_versions': caveats_versions
    })


def resources(request, prefix):
    return render(request, 'metadata/resources.html', {
        'title': 'DOI',
        'resources': Resource.objects.using('metadata').exclude(datacite=None).order_by('paths'),
        'resources_external': Resource.objects.using('metadata').filter(datacite=None).order_by('paths')
    })


def resource(request, doi=None):
    queryset = Resource.objects.using('metadata').prefetch_related('datasets__links')

    resource = get_object_or_404(queryset, doi=doi)

    references = defaultdict(list)
    if resource.datacite is not None:
        for identifier in resource.datacite.get('relatedIdentifiers'):
            if identifier.get('relationType') in [
                'IsNewVersionOf',
                'IsPreviousVersionOf',
                'IsDocumentedBy',
                'Cites',
                'IsDerivedFrom',
                'HasPart'
            ]:
                references[identifier.get('relationType')].append(identifier)
            else:
                references['Other'].append(identifier)

    dataset_ids = [str(dataset_id) for dataset_id in resource.datasets.values_list('id', flat=True)]
    caveats = Caveat.objects.filter(datasets__contains=dataset_ids).public(request.user) if dataset_ids else []

    return render(request, 'metadata/resource.html', {
        'title': 'DOI {}'.format(resource.doi),
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
        'title': 'Attributes',
        'attributes': attributes_list
    })
