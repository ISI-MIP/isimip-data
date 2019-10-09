import os

from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.postgres.search import SearchVectorField


class Dataset(models.Model):

    id = models.UUIDField(primary_key=True)

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    attributes = JSONField()
    search_vector = SearchVectorField(null=True)

    class Meta:
        db_table = 'datasets'
        managed = False
        ordering = ('name', )

    @property
    def filelist(self):
        return os.linesep.join([file.url for file in self.files.all()])


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
        ordering = ('name', )

    @property
    def url(self):
        return os.path.join(settings.FILES_BASE_URL, '%s_v%s.nc4' % (self.path, self.version))


class Word(models.Model):

    word = models.TextField(primary_key=True)

    class Meta:
        db_table = 'words'
        managed = False
        ordering = ('word', )
