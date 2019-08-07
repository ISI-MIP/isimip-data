from django.shortcuts import get_object_or_404, render

from .models import Dataset, File


def dataset(request, dataset_name):
    dataset = get_object_or_404(Dataset.objects.using('metadata'), name=dataset_name)

    return render(request, 'metadata/dataset.html', {
        'dataset': dataset
    })


def file(request, file_name):
    file = get_object_or_404(File.objects.using('metadata'), name=file_name)

    return render(request, 'metadata/file.html', {
        'file': file
    })
