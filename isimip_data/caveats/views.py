from urllib.parse import urlparse

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import resolve
from django.utils.translation import gettext as _

from isimip_data.metadata.models import Dataset
from isimip_data.metadata.utils import prettify_attributes_dict

from .forms import CaveatForm
from .models import Caveat


def caveats(request):
    caveats = Caveat.objects.order_by('-updated')

    return render(request, 'caveats/caveats.html', {
        'caveats': caveats
    })


def caveat(request, pk=None):
    caveat = get_object_or_404(Caveat.objects.all(), id=pk)
    datasets = Dataset.objects.using('metadata').filter(id__in=caveat.datasets)

    return render(request, 'caveats/caveat.html', {
        'caveat': caveat,
        'specifiers': prettify_attributes_dict(caveat.specifiers),
        'datasets': datasets
    })


@login_required
def caveat_create(request):
    referrer = request.META.get('HTTP_REFERER', None)
    if referrer:
        match = resolve(urlparse(referrer)[2])
        dataset_id = match.kwargs.get('pk') if match.url_name == 'dataset' else None
    else:
        dataset_id = None

    form = CaveatForm(request.POST or None, creator=request.user, dataset_id=dataset_id)

    if request.method == 'POST' and form.is_valid():
        caveat = form.save()
        messages.add_message(
            request,
            messages.SUCCESS,
            _('Caveat successfully submitted.'),
        )
        return redirect('caveat', caveat.id)

    return render(request, 'caveats/caveat_create.html', {
        'form': form
    })
