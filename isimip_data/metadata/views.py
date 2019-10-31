from django.shortcuts import get_object_or_404, render

from .models import Dataset, File


def dataset(request, dataset_id):
    dataset = get_object_or_404(Dataset.objects.using('metadata'), id=dataset_id)

    return render(request, 'metadata/dataset.html', {
        'dataset': dataset
    })


def file(request, file_id):
    file = get_object_or_404(File.objects.using('metadata'), id=file_id)

    return render(request, 'metadata/file.html', {
        'file': file
    })
