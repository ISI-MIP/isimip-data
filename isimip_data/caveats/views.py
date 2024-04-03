from django.conf import settings
from django.shortcuts import get_object_or_404, render

from isimip_data.metadata.models import Dataset

from .models import Caveat


def caveats(request):
    caveats = Caveat.objects.public(request.user) \
                            .select_related('creator')

    return render(request, 'caveats/caveats.html', {
        'title': 'Caveats',
        'caveats': caveats
    })


def caveat(request, pk=None):
    queryset = Caveat.objects.public(request.user)
    caveat = get_object_or_404(queryset, id=pk)
    comments = caveat.comments.public(request.user)
    datasets = Dataset.objects.using('metadata') \
                              .filter(target=None, id__in=caveat.datasets[:settings.CAVEATS_MAX_DATASETS]) \
                              .prefetch_related('links')

    return render(request, 'caveats/caveat.html', {
        'title': caveat.title,
        'caveat': caveat,
        'comments': comments,
        'count': len(caveat.datasets),
        'datasets': datasets,
        'search_url': request.build_absolute_uri(caveat.get_search_url()),
    })
