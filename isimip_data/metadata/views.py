from django.shortcuts import get_object_or_404, render

from .models import Dataset, File
from .utils import prettify_attributes


def dataset(request, dataset_id):
    dataset_instance = get_object_or_404(Dataset.objects.using('metadata'), id=dataset_id)

    return render(request, 'metadata/dataset.html', {
        'dataset': dataset_instance,
        'attributes': prettify_attributes(dataset_instance.attributes)
    })


def file(request, file_id):
    file_instance = get_object_or_404(File.objects.using('metadata'), id=file_id)

    return render(request, 'metadata/file.html', {
        'file': file_instance,
        'attributes': prettify_attributes(file_instance.attributes)
    })
