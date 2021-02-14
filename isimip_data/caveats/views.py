
from django.shortcuts import get_object_or_404, render

from isimip_data.metadata.models import Dataset
from isimip_data.metadata.utils import prettify_attributes_dict

from .models import Caveat


def caveats(request):
    caveats = Caveat.objects.all()

    return render(request, 'caveats/caveats.html', {
        'caveats': caveats
    })


def caveat(request, pk=None):
    caveat = get_object_or_404(Caveat.objects.all(), id=pk)
    datasets = Dataset.objects.using('metadata').filter(id__in=caveat.datasets)

    print(caveat.datasets)
    print(datasets)

    return render(request, 'caveats/caveat.html', {
        'caveat': caveat,
        'specifiers': prettify_attributes_dict(caveat.specifiers),
        'datasets': datasets
    })
