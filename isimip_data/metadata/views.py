from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render

from .models import Attribute, Dataset, File
from .utils import prettify_attributes


def dataset(request, pk=None, checksum=None):
    if pk is not None:
        dataset_obj = get_object_or_404(Dataset.objects.using('metadata'), id=pk)
    elif checksum is not None:
        dataset_obj = get_object_or_404(Dataset.objects.using('metadata'), checksum=checksum)
    else:
        raise RuntimeError('Either pk or checksum need to be provided')

    versions = Dataset.objects.using('metadata').filter(path=dataset_obj.path) \
                                                .exclude(id=pk) \
                                                .order_by('version')

    return render(request, 'metadata/dataset.html', {
        'dataset': dataset_obj,
        'versions': versions,
        'attributes': prettify_attributes(dataset_obj.attributes)
    })


def file(request, pk=None, checksum=None):
    if pk is not None:
        file_obj = get_object_or_404(File.objects.using('metadata'), id=pk)
    elif checksum is not None:
        file_obj = get_object_or_404(File.objects.using('metadata'), checksum=checksum)
    else:
        raise RuntimeError('Either pk or checksum need to be provided')

    versions = File.objects.using('metadata').filter(path=file_obj.path) \
                                             .exclude(id=file_obj.id) \
                                             .order_by('version')

    return render(request, 'metadata/file.html', {
        'file': file_obj,
        'versions': versions,
        'attributes': prettify_attributes(file_obj.attributes)
    })


@login_required
def attributes(request):
    attributes_list = []
    for attribute in Attribute.objects.using('metadata').all():
        attributes_list.append((attribute, Dataset.objects.using('metadata').histogram(attribute)))

    return render(request, 'metadata/attributes.html', {
        'attributes': attributes_list
    })
