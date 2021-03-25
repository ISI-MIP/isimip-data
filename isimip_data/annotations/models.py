import mimetypes
from pathlib import Path

from django.db import models


class Figure(models.Model):
    title = models.CharField(max_length=128)
    image = models.ImageField(upload_to='figures')
    caption = models.TextField(blank=True)
    credits = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title

    @property
    def image_name(self):
        return Path(self.image.name).name

    @property
    def image_type(self):
        try:
            return mimetypes.guess_type(self.image_name)[0]
        except IndexError:
            return None


class Download(models.Model):
    title = models.CharField(max_length=128)
    file = models.FileField(upload_to='files')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title
