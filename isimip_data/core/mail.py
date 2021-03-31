from django.conf import settings
from django.core.mail import EmailMessage


def send_mail(subject, message, from_email=None, to=[], cc=[], bcc=[], reply_to=None, attachments=[]):
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL

    mail = EmailMessage(subject, message, from_email, to=to, cc=cc, bcc=bcc, reply_to=reply_to, attachments=attachments)
    mail.send()
