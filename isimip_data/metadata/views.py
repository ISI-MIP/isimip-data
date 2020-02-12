from django.shortcuts import get_object_or_404, render

from .models import Dataset, File
from .utils import prettify_attributes


def dataset(request, dataset_id):
    dataset_obj = get_object_or_404(Dataset.objects.using('metadata'), id=dataset_id)
    versions = Dataset.objects.using('metadata').filter(path=dataset_obj.path) \
                                                .exclude(id=dataset_id) \
                                                .order_by('version')

    return render(request, 'metadata/dataset.html', {
        'dataset': dataset_obj,
        'versions': versions,
        'attributes': prettify_attributes(dataset_obj.attributes)
    })


def file(request, file_id):
    file_obj = get_object_or_404(File.objects.using('metadata'), id=file_id)
    versions = File.objects.using('metadata').filter(path=file_obj.path) \
                                             .exclude(id=file_id) \
                                             .order_by('version')

    return render(request, 'metadata/file.html', {
        'file': file_obj,
        'versions': versions,
        'attributes': prettify_attributes(file_obj.attributes)
    })
