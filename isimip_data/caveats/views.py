from urllib.parse import urlparse

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import resolve, reverse
from django.utils.translation import gettext as _

from isimip_data.metadata.models import Dataset
from isimip_data.metadata.utils import prettify_attributes_dict

from .forms import CaveatForm, CommentForm
from .models import Caveat


def caveats(request):
    q = Q(public=True)
    if request.user.is_authenticated:
        q |= Q(creator=request.user)

    caveats = Caveat.objects.filter(q).order_by('-updated')

    return render(request, 'caveats/caveats.html', {
        'caveats': caveats
    })


def caveat(request, pk=None):
    q = Q(public=True)
    if request.user.is_authenticated:
        q |= Q(creator=request.user)

    caveat = get_object_or_404(Caveat.objects.filter(q), id=pk)
    comments = caveat.comments.filter(q)
    datasets = Dataset.objects.using('metadata').filter(id__in=caveat.datasets)

    return render(request, 'caveats/caveat.html', {
        'caveat': caveat,
        'specifiers': prettify_attributes_dict(caveat.specifiers),
        'comments': comments,
        'datasets': datasets,
        'comment_form': CommentForm(caveat=caveat)
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


@login_required
def comment_create(request):
    if request.method == 'POST':
        form = CommentForm(request.POST or None, creator=request.user)

        if form.is_valid():
            comment = form.save()
            messages.add_message(
                request,
                messages.SUCCESS,
                _('Comment successfully submitted.'),
            )

            url = reverse('caveat', args=[comment.caveat.id]) + '#comments'
            return redirect(url)
        else:
            return HttpResponseBadRequest()
    else:
        return redirect('caveats')
