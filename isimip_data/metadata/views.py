from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect, render

from .models import Attribute, Dataset, File, Resource
from .utils import prettify_attributes


def metadata(request):
    dataset = request.GET.get('dataset')
    if dataset:
        return redirect('dataset', dataset.strip())

    file = request.GET.get('file')
    if file:
        return redirect('file', file.strip())

    return render(request, 'metadata/metadata.html')


def dataset(request, pk=None, path=None, checksum=None):
    if pk is not None:
        obj = get_object_or_404(Dataset.objects.using('metadata'), id=pk)
    elif path is not None:
        obj = get_object_or_404(Dataset.objects.using('metadata'), path=path)
    elif checksum is not None:
        obj = Dataset.objects.using('metadata').filter(checksum=checksum).order_by('-version').first()
        if not obj:
            raise Http404()
    else:
        raise RuntimeError('Either pk, path or checksum need to be provided')

    versions = Dataset.objects.using('metadata').filter(path=obj.path) \
                                                .exclude(id=obj.id) \
                                                .order_by('-version')

    return render(request, 'metadata/dataset.html', {
        'dataset': obj,
        'versions': versions,
        'attributes': prettify_attributes(obj.attributes)
    })


def file(request, pk=None, path=None, checksum=None):
    if pk is not None:
        obj = get_object_or_404(File.objects.using('metadata'), id=pk)
    elif path is not None:
        obj = get_object_or_404(File.objects.using('metadata'), path=path)
    elif checksum is not None:
        obj = File.objects.using('metadata').filter(checksum=checksum).order_by('-version').first()
        if not obj:
            raise Http404()
    else:
        raise RuntimeError('Either pk, path or checksum need to be provided')

    versions = File.objects.using('metadata').filter(path=obj.path) \
                                             .exclude(id=obj.id) \
                                             .order_by('-version')

    return render(request, 'metadata/file.html', {
        'file': obj,
        'versions': versions,
        'attributes': prettify_attributes(obj.attributes)
    })


def resource(request, resource_type=None, pk=None, path=None, doi=None):
    queryset = Resource.objects.using('metadata').filter(type=resource_type)

    if pk is not None:
        obj = get_object_or_404(queryset, id=pk)
    elif path is not None:
        obj = get_object_or_404(queryset, path=path)
    elif doi is not None:
        obj = get_object_or_404(queryset, doi=doi)
    else:
        raise RuntimeError('Either pk, path or checksum need to be provided')

    return render(request, 'metadata/resource.html', {
        'resource': obj
    })


@login_required
def attributes(request):
    attributes_list = []
    for attribute in Attribute.objects.using('metadata').all():
        attributes_list.append((attribute, Dataset.objects.using('metadata').histogram(attribute)))

    return render(request, 'metadata/attributes.html', {
        'attributes': attributes_list
    })
