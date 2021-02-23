from urllib.parse import urlparse

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import resolve
from django.utils.translation import gettext as _

from isimip_data.metadata.models import Dataset
from isimip_data.metadata.utils import prettify_attributes_dict

from .forms import CaveatForm, CommentForm
from .mail import send_caveat_notifications, send_comment_notifications
from .models import Caveat


def caveats(request):
    caveats = Caveat.objects.public(request.user)

    return render(request, 'caveats/caveats.html', {
        'caveats': caveats
    })


def caveat(request, pk=None):
    caveat = get_object_or_404(Caveat.objects.public(request.user), id=pk)
    comments = caveat.comments.public(request.user)
    datasets = Dataset.objects.using('metadata').filter(id__in=caveat.datasets)

    return render(request, 'caveats/caveat.html', {
        'caveat': caveat,
        'specifiers': prettify_attributes_dict(caveat.specifiers),
        'comments': comments,
        'datasets': datasets,
        'comment_form': CommentForm(caveat=caveat, creator=request.user)
    })


@login_required
def caveat_subscribe(request, pk=None):
    caveat = get_object_or_404(Caveat.objects.public(request.user), id=pk)
    caveat.subscribers.add(request.user)
    messages.add_message(request, messages.SUCCESS, _('You are now subscribed to this caveat.'))
    return redirect('caveat', caveat.id)


@login_required
def caveat_unsubscribe(request, pk=None):
    caveat = get_object_or_404(Caveat.objects.public(request.user), id=pk)
    caveat.subscribers.remove(request.user)
    messages.add_message(request, messages.SUCCESS, _('You are not longer subscribed to this caveat.'))
    return redirect('caveat', caveat.id)


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
        caveat.subscribers.add(request.user)
        if not caveat.public:
            send_caveat_notifications(request, caveat)
        messages.add_message(request, messages.SUCCESS, _('Caveat successfully submitted.'))
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
            comment.caveat.subscribers.add(request.user)
            send_comment_notifications(request, comment)
            messages.add_message(request, messages.SUCCESS, _('Comment successfully submitted.'))
            return redirect(comment.get_absolute_url())
        else:
            return HttpResponseBadRequest()
    else:
        return redirect('caveats')
