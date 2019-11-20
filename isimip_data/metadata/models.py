import os

from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.postgres.search import SearchVectorField

from .managers import DatasetManager


class Dataset(models.Model):

    objects = DatasetManager()

    id = models.UUIDField(primary_key=True)

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    attributes = JSONField()
    search_vector = SearchVectorField(null=True)

    class Meta:
        db_table = 'datasets'
        managed = False
        ordering = ('path', )

    def __str__(self):
        return self.path

    @property
    def json_url(self):
        return os.path.join(settings.FILES_BASE_URL, '%s_v%s.json' % (self.path, self.version))

    @property
    def thumbnail_url(self):
        return os.path.join(settings.FILES_BASE_URL, '%s_v%s.png' % (self.path, self.version))


class Latest(models.Model):

    dataset = models.OneToOneField('Dataset', on_delete=models.CASCADE, primary_key=True)
    version = models.TextField()

    class Meta:
        db_table = 'latest'
        managed = False
        ordering = ('version', )


class File(models.Model):

    id = models.UUIDField(primary_key=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='files')

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    path = models.TextField()
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
    def url(self):
        return os.path.join(settings.FILES_BASE_URL, '%s_v%s.nc4' % (self.path, self.version))

    @property
    def json_url(self):
        return os.path.join(settings.FILES_BASE_URL, '%s_v%s.json' % (self.path, self.version))

    @property
    def checksum_url(self):
        return os.path.join(settings.FILES_BASE_URL, '%s_v%s.%s' % (self.path, self.version, self.checksum_type))

    @property
    def thumbnail_url(self):
        return os.path.join(settings.FILES_BASE_URL, '%s_v%s.png' % (self.path, self.version))


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
