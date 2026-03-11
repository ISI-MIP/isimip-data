from django.conf import settings
from django.core.mail import EmailMessage


def send_mail(subject, message, from_email=None, to=None, cc=None, bcc=None, reply_to=None, attachments=None):
    mail = EmailMessage(
        subject,
        message,
        from_email or settings.DEFAULT_FROM_EMAIL,
        to=to or [],
        cc=cc or [],
        bcc=bcc or [],
        reply_to=reply_to or [],
        attachments=attachments or []
    )
    mail.send()
