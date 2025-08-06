import json
import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.urls import reverse

from .managers import ResourceManager
from .utils import encode_token


def generate_token():
    return secrets.token_urlsafe(24)


class Resource(models.Model):

    objects = ResourceManager()

    title = models.CharField(max_length=512)
    description = models.TextField()
    paths = ArrayField(models.TextField())

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title


class Token(models.Model):

    resource = models.ForeignKey('Resource', null=True, on_delete=models.SET_NULL, related_name='tokens')
    subject = models.EmailField()

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('subject', )

    def __str__(self):
        return self.subject

    @property
    def expires(self):
        if self.updated is not None:
            return self.updated + timedelta(seconds=int(settings.FILES_AUTH_TTL))

    @property
    def as_dict(self):
        return {
            "sub": self.subject,
            "iat": self.updated,
            "exp": self.expires,
            "paths": self.resource.paths if self.resource else [],
        }

    @property
    def as_json(self):
        return json.dumps(self.as_dict, indent=4, default=str)

    @property
    def as_jwt(self):
        return encode_token(self.as_dict)

    @property
    def as_header(self):
        return f'Authorization: Bearer {self.as_jwt}'

    def get_absolute_url(self, request):
        return request.build_absolute_uri(reverse('token', args=[self.as_jwt]))
