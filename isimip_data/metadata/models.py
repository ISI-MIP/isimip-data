from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.contrib.postgres.fields import ArrayField, JSONField
from django.contrib.postgres.search import SearchVectorField
from django.db import models

from .managers import DatasetManager
from .utils import get_rights, get_terms_of_use


class Dataset(models.Model):

    objects = DatasetManager()

    id = models.UUIDField(primary_key=True)

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    size = models.BigIntegerField()
    specifiers = JSONField()
    identifiers = ArrayField(models.TextField())
    search_vector = SearchVectorField(null=True)
    public = models.BooleanField(null=True)
    tree_path = models.TextField()

    class Meta:
        db_table = 'datasets'
        managed = False
        ordering = ('path', )

    def __str__(self):
        return self.path

    @property
    def is_global(self):
        return '_global_' in self.name

    @property
    def is_netcdf(self):
        return all([Path(file.path).suffix.startswith('.nc') for file in self.files.all()])

    @property
    def specifier_list(self):
        return [(identifier, self.specifiers.get(identifier)) for identifier in self.identifiers]

    @property
    def rights(self):
        return get_rights(self.path)

    @property
    def terms_of_use(self):
        return get_terms_of_use()


class File(models.Model):

    id = models.UUIDField(primary_key=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='files')

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    size = models.BigIntegerField()
    checksum = models.TextField()
    checksum_type = models.TextField()
    specifiers = JSONField()
    identifiers = ArrayField(models.TextField())
    search_vector = SearchVectorField(null=True)

    class Meta:
        db_table = 'files'
        managed = False
        ordering = ('path', )

    def __str__(self):
        return self.path

    @property
    def file_url(self):
        if self.dataset.public:
            return settings.FILES_BASE_URL + str(Path(self.path))

    @property
    def json_url(self):
        if self.dataset.public:
            return settings.FILES_BASE_URL + str(Path(self.path).with_suffix('.json'))

    @property
    def thumbnail_url(self):
        if self.dataset.public:
            return settings.FILES_BASE_URL + str(Path(self.path).with_suffix('.png'))

    @property
    def checksum_url(self):
        if self.dataset.public:
            return settings.FILES_BASE_URL + str(Path(self.path).with_suffix('.' + self.checksum_type))

    @property
    def is_global(self):
        return '_global_' in self.name

    @property
    def is_netcdf(self):
        return Path(self.path).suffix.startswith('.nc')

    @property
    def specifier_list(self):
        return [(identifier, self.specifiers.get(identifier)) for identifier in self.identifiers]

    @property
    def rights(self):
        return get_rights(self.path)

    @property
    def terms_of_use(self):
        return get_terms_of_use()


class Resource(models.Model):

    id = models.UUIDField(primary_key=True)
    doi = models.TextField()
    datacite = JSONField()

    datasets = models.ManyToManyField(Dataset, related_name='resources')

    class Meta:
        db_table = 'resources'
        managed = False
        ordering = ('doi', )

    def __str__(self):
        return self.path

    @property
    def title(self):
        for datacite_title in self.datacite.get('titles'):
            if ('title' in datacite_title) and ('titleType' not in datacite_title):
                return datacite_title['title']

        return self.path

    @property
    def major_version(self):
        version = self.datacite.get('version')
        if version:
            return '.'.join(version.split('.')[:2])

    @property
    def doi_url(self):
        return 'https://doi.org/{}'.format(self.doi)

    @property
    def creators_str(self):
        return ', '.join([creator.get('name', '') for creator in self.datacite.get('creators', [])])

    @property
    def contact_persons(self):
        return [
            contributor for contributor in self.datacite.get('contributors', [])
            if contributor.get('contributorType') == 'ContactPerson'
        ]

    @property
    def publication_date(self):
        date_string = next(item.get('date') for item in self.datacite.get('dates', []) if item.get('dateType') == 'Issued')
        if date_string is not None:
            try:
                return datetime.strptime(date_string, '%Y-%m-%d')
            except ValueError:
                return datetime.strptime(date_string, '%Y')

    @property
    def rights(self):
        for rights in self.datacite.get('rightsList', []):
            rights_uri = rights.get('rightsURI')
            if rights_uri:
                rights = settings.RIGHTS.get(rights_uri)
                if rights:
                    rights['rights_uri'] = rights_uri
                    return rights

    @property
    def terms_of_use(self):
        return get_terms_of_use()


class Tree(models.Model):

    id = models.UUIDField(primary_key=True)
    tree_dict = JSONField()

    class Meta:
        db_table = 'trees'
        managed = False
        ordering = ('id', )

    def __str__(self):
        return str(self.id)


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
