from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.utils.translation import gettext as _

from .forms import DeleteProfileForm, ProfileForm


@login_required()
def profile_update(request):
    form = ProfileForm(request.POST or None, instance=request.user)

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.add_message(
            request,
            messages.SUCCESS,
            _('Profile successfully updated.'),
        )

    return render(request, 'profile/profile_update.html', {
        'form': form
    })


@login_required()
def profile_delete(request):
    form = DeleteProfileForm(request.POST or None)

    if request.method == 'POST' and form.is_valid():
        request.user.delete()
        logout(request)
        messages.add_message(
            request,
            messages.SUCCESS,
            _('Profile deleted.'),
        )
        return redirect('profile_delete_success')

    return render(request, 'profile/profile_delete.html', {
        'form': form
    })


def profile_delete_success(request):
    return render(request, 'profile/profile_delete_success.html')
