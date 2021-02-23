from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.template.loader import render_to_string

from isimip_data.core.mail import send_mail


def send_caveat_notifications(request, caveat):
    context = {
        'caveat': caveat,
        'caveat_url': request.build_absolute_uri(caveat.get_absolute_url()),
        'admin_url': request.build_absolute_uri(caveat.get_admin_url()),
        'site': Site.objects.get_current()
    }

    from_email = '{} <{}>'.format(caveat.get_creator_display(), settings.DEFAULT_FROM_EMAIL)
    subject = render_to_string('caveats/email/caveat_notification_subject.txt', context, request=request)
    message = render_to_string('caveats/email/caveat_notification_message.txt', context, request=request)

    to = User.objects.filter(is_staff=True).values_list('email', flat=True)
    send_mail(subject, message, from_email=from_email, to=to)


def send_comment_notifications(request, comment):
    context = {
        'comment': comment,
        'reply_url': request.build_absolute_uri(comment.caveat.get_reply_url()),
        'unsubscribe_url': request.build_absolute_uri(comment.caveat.get_unsubscribe_url()),
        'site': Site.objects.get_current()
    }

    from_email = '{} <{}>'.format(comment.get_creator_display(), settings.DEFAULT_FROM_EMAIL)
    subject = render_to_string('caveats/email/comment_notification_subject.txt', context, request=request)
    message = render_to_string('caveats/email/comment_notification_message.txt', context, request=request)

    for subscriber in comment.caveat.subscribers.exclude(id=comment.creator.id):
        send_mail(subject, message, from_email=from_email, to=[subscriber.email])
