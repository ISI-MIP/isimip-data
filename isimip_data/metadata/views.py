from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from .models import Attribute, Dataset, File
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
        obj = get_object_or_404(Dataset.objects.using('metadata'), checksum=checksum)
    else:
        raise RuntimeError('Either pk, path or checksum need to be provided')

    versions = Dataset.objects.using('metadata').filter(path=obj.path) \
                                                .exclude(id=pk) \
                                                .order_by('version')

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
        obj = get_object_or_404(File.objects.using('metadata'), checksum=checksum)
    else:
        raise RuntimeError('Either pk, path or checksum need to be provided')

    versions = File.objects.using('metadata').filter(path=obj.path) \
                                             .exclude(id=obj.id) \
                                             .order_by('version')

    return render(request, 'metadata/file.html', {
        'file': obj,
        'versions': versions,
        'attributes': prettify_attributes(obj.attributes)
    })


@login_required
def attributes(request):
    attributes_list = []
    for attribute in Attribute.objects.using('metadata').all():
        attributes_list.append((attribute, Dataset.objects.using('metadata').histogram(attribute)))

    return render(request, 'metadata/attributes.html', {
        'attributes': attributes_list
    })
