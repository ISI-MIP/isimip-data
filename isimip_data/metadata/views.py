import json
from collections import defaultdict
from uuid import UUID

from django.conf import settings
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render, reverse

from datacite import schema43

from isimip_data.annotations.models import Download, Figure, Reference
from isimip_data.caveats.models import Caveat
from isimip_data.core.utils import get_file_base_url

from .models import Dataset, File, Identifier, Resource
from .utils import render_bibtex


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
        caveats_versions = Caveat.objects.exclude(id__in=[caveat.id for caveat in caveats]) \
                                         .filter(datasets__overlap=caveats_datasets)
    else:
        caveats_versions = None

    return render(request, 'metadata/dataset.html', {
        'title': f'Dataset {obj.name}',
        'dataset': obj,
        'file_base_url': get_file_base_url(request),
        'versions': versions,
        'public_version': versions.exclude(id=obj.id).filter(public=True).first(),
        'figures': Figure.objects.filter(annotations__datasets__contains=[obj.id]),
        'downloads': Download.objects.filter(annotations__datasets__contains=[obj.id]),
        'references': Reference.objects.filter(annotations__datasets__contains=[obj.id]),
        'caveats': caveats,
        'caveats_versions': caveats_versions,
        'json_ld': obj.json_ld
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
        caveats_versions = Caveat.objects.exclude(id__in=[caveat.id for caveat in caveats]) \
                                         .filter(datasets__overlap=caveats_datasets)
    else:
        caveats_versions = None

    return render(request, 'metadata/file.html', {
        'title': f'File {obj.name}',
        'file': obj,
        'file_base_url': get_file_base_url(request),
        'parents': [obj.dataset],
        'versions': versions,
        'public_version': versions.exclude(id=obj.id).filter(dataset__public=True).first(),
        'caveats': caveats,
        'caveats_versions': caveats_versions,
        'json_ld': obj.json_ld
    })


def resources(request):
    return render(request, 'metadata/resources.html', {
        'title': 'DOI',
        'count': Resource.objects.using('metadata').count()
    })


def resource(request, pk=None, doi=None):
    queryset = Resource.objects.using('metadata')

    if pk is not None:
        resource = get_object_or_404(queryset, pk=pk)
    elif doi is not None:
        resource = get_object_or_404(queryset, doi=doi)

    references = defaultdict(list)
    if resource.datacite is not None:
        for identifier in resource.datacite.get('relatedIdentifiers', []):
            if identifier.get('relationType') in [
                'IsNewVersionOf',
                'IsPreviousVersionOf',
                'IsDocumentedBy',
                'Cites',
                'IsDerivedFrom'
            ]:
                references[identifier.get('relationType')].append(identifier)
            else:
                references['Other'].append(identifier)

    caveats = Caveat.objects.filter(resources__contains=[str(resource.id)]).public(request.user)
    count = resource.datasets.count()
    datasets = resource.datasets.prefetch_related('links').order_by('path')[:settings.METADATA_RESOURCE_MAX_DATASETS]

    return render(request, 'metadata/resource.html', {
        'title': f'DOI {resource.doi}',
        'resource': resource,
        'references': references,
        'caveats': caveats,
        'datasets': datasets,
        'count': count,
        'search_url': request.build_absolute_uri(reverse('search')) + 'query/' + resource.doi + '/',
        'json_ld': resource.json_ld
    })


def resource_bibtex(request, doi=None):
    resource = get_object_or_404(Resource.objects.using('metadata'), doi=doi)
    bibtex = render_bibtex(resource)
    response = HttpResponse(bibtex, content_type="application/x-bibtex")
    response['Content-Disposition'] = f'filename="{doi}.bib"'
    return response


def resource_xml(request, doi=None):
    resource = get_object_or_404(Resource.objects.using('metadata'), doi=doi)
    xml_string = schema43.tostring(resource.datacite)
    response = HttpResponse(xml_string, content_type='application/xml')
    response['Content-Disposition'] = f'filename="{doi}.xml"'
    return response


def resource_json(request, doi=None):
    resource = get_object_or_404(Resource.objects.using('metadata'), doi=doi)
    json_string = json.dumps(resource.datacite, indent=2)
    response = HttpResponse(json_string, content_type='application/json')
    response['Content-Disposition'] = f'filename="{doi}.json"'
    return response


def identifiers(request):
    identifiers_list = []
    for identifier in Identifier.objects.using('metadata').identifiers():
        identifiers_list.append((identifier, Dataset.objects.using('metadata').histogram(identifier)))

    return render(request, 'metadata/identifiers.html', {
        'title': 'Identifiers',
        'identifiers': identifiers_list
    })
