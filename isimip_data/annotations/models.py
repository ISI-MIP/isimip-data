import mimetypes
from pathlib import Path

from django.contrib.postgres.fields import ArrayField
from django.core.cache import cache
from django.db import models
from django.utils.translation import gettext_lazy as _

from .utils import query_datasets


class Annotation(models.Model):
    title = models.CharField(max_length=128)
    specifiers = models.JSONField(default=dict)
    datasets = ArrayField(models.UUIDField(), blank=True, default=list)
    version_after = models.CharField(max_length=8, blank=True)
    version_before = models.CharField(max_length=8, blank=True)
    figures = models.ManyToManyField('Figure', related_name='annotations')
    downloads = models.ManyToManyField('Download', related_name='annotations')
    references = models.ManyToManyField('Reference', related_name='annotations')

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.datasets = query_datasets(self.specifiers, self.version_after, self.version_before)
        cache.clear()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.clear()
        super().delete(*args, **kwargs)


class Figure(models.Model):
    title = models.CharField(max_length=128)
    image = models.ImageField(upload_to='figures')
    caption = models.TextField(blank=True)
    credits = models.TextField(blank=True)
    width = models.IntegerField(default=12, help_text='Width in columns (12 is full width).')
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


class Reference(models.Model):

    IDENTIFIER_TYPE_DOI = 'doi'
    IDENTIFIER_TYPE_URL = 'url'
    IDENTIFIER_TYPE_CHOICES = (
        (IDENTIFIER_TYPE_DOI, _('DOI')),
        (IDENTIFIER_TYPE_URL, _('URL'))
    )

    REFERENCE_TYPE_ISIPEDIA = 'ISIPEDIA'
    REFERENCE_TYPE_EVALUATION = 'EVALUATION'
    REFERENCE_TYPE_OTHER = 'OTHER'
    REFERENCE_TYPE_CHOICES = (
        (REFERENCE_TYPE_ISIPEDIA, _('ISIpedia')),
        (REFERENCE_TYPE_EVALUATION, _('Evaluation')),
        (REFERENCE_TYPE_OTHER, _('Other'))
    )

    title = models.TextField()
    identifier = models.URLField()
    identifier_type = models.TextField(choices=IDENTIFIER_TYPE_CHOICES)
    reference_type = models.TextField(choices=REFERENCE_TYPE_CHOICES)

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title
