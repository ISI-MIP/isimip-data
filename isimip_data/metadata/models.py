from pathlib import Path

from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.contrib.postgres.search import SearchVectorField
from django.db import models

from .managers import DatasetManager


class Dataset(models.Model):

    objects = DatasetManager()

    id = models.UUIDField(primary_key=True)

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    checksum = models.TextField()
    checksum_type = models.TextField()
    attributes = JSONField()
    search_vector = SearchVectorField(null=True)
    public = models.BooleanField(null=True)

    class Meta:
        db_table = 'datasets'
        managed = False
        ordering = ('path', )

    def __str__(self):
        return self.path


class File(models.Model):

    id = models.UUIDField(primary_key=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='files')

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    checksum = models.TextField()
    checksum_type = models.TextField()
    attributes = JSONField()
    search_vector = SearchVectorField(null=True)

    class Meta:
        db_table = 'files'
        managed = False
        ordering = ('path', )

    def __str__(self):
        return self.path

    @property
    def file_url(self):
        return settings.FILES_BASE_URL + str(Path(self.path))

    @property
    def json_url(self):
        return settings.FILES_BASE_URL + str(Path(self.path).with_suffix('.json'))

    @property
    def checksum_url(self):
        return settings.FILES_BASE_URL + str(Path(self.path).with_suffix('.' + self.checksum_type))

    @property
    def thumbnail_url(self):
        return settings.FILES_BASE_URL + str(Path(self.path).with_suffix('.png'))


class Word(models.Model):

    word = models.TextField(primary_key=True)

    class Meta:
        db_table = 'words'
        managed = False
        ordering = ('word', )

    def __str__(self):
        return self.word


class Attribute(models.Model):

    key = models.TextField(primary_key=True)

    class Meta:
        db_table = 'attributes'
        managed = False
        ordering = ('key', )

    def __str__(self):
        return self.key
