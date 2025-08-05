from django.conf import settings
from django.shortcuts import render
from django.template.loader import render_to_string

import jwt as pyjwt

from isimip_data.core.mail import send_mail

from .forms import AccessForm
from .models import Resource, Token


def access(request, path):
    resource = Resource.objects.find_by_path(path)
    if resource:
        form = AccessForm(request.POST or None)

        if request.method == 'POST' and form.is_valid():
            token, created = Token.objects.update_or_create(
                subject=form.cleaned_data['subject'],
                resource=resource
            )
            token.save()

            context = {
                'resource': resource,
                'token': token,
                'token_url': token.get_absolute_url(request)
            }
            subject = render_to_string('access/email/access_confirmation_subject.txt', context)
            message = render_to_string('access/email/access_confirmation_message.txt', context)

            send_mail(subject, message, to=[form.instance.subject], reply_to=settings.ACCESS_REPLY_TO)

        return render(request, 'access/access.html', {
            'resource': resource,
            'form': form
        })
    else:
        return render(request, 'access/access_error.html', {
            'path': path
        })


def token(request, jwt):
    try:
        payload = pyjwt.decode(jwt, settings.FILES_AUTH_SECRET, algorithms=["HS256"])
        token = Token.objects.get(subject=payload['sub'], resource__paths=payload['paths'])
    except Token.DoesNotExist:
        return render(request, 'access/token_error.html', {
            'error': 'The no matching token was found in our database.'
        })

    response = render(request, 'access/token.html', {
        'resource': token.resource,
        'token': token
    })

    for path in token.resource.paths:
        response.set_cookie(
            f'isimip_access_token_{token.as_jwt[-8:]}',
            value=token.as_jwt,
            expires=token.expires,
            domain=settings.FILES_AUTH_DOMAIN,
            secure=False,
            httponly=False,
            samesite=None
        )

    return response
