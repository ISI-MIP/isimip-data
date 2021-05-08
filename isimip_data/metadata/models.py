from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.contrib.postgres.fields import ArrayField, JSONField
from django.contrib.postgres.search import SearchVectorField
from django.db import models
from django.urls import reverse

from .constants import RIGHTS
from .managers import AttributeManager, DatasetManager
from .utils import get_terms_of_use


class Dataset(models.Model):

    objects = DatasetManager()

    id = models.UUIDField(primary_key=True)

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    size = models.BigIntegerField()
    specifiers = JSONField()
    rights = models.TextField()
    identifiers = ArrayField(models.TextField())
    search_vector = SearchVectorField(null=True)
    public = models.BooleanField(null=True)
    tree_path = models.TextField()

    created = models.DateTimeField()
    updated = models.DateTimeField()
    published = models.DateTimeField()
    archived = models.DateTimeField()

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
    def rights_dict(self):
        return RIGHTS.get(self.rights, {})

    @property
    def terms_of_use(self):
        return get_terms_of_use()

    def get_absolute_url(self):
        return reverse('dataset', kwargs={'pk': self.pk})


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
    rights = models.TextField()
    identifiers = ArrayField(models.TextField())
    search_vector = SearchVectorField(null=True)

    created = models.DateTimeField()
    updated = models.DateTimeField()

    class Meta:
        db_table = 'files'
        managed = False
        ordering = ('path', )

    def __str__(self):
        return self.path

    @property
    def public(self):
        return self.dataset.public

    @property
    def resources(self):
        return self.dataset.resources

    @property
    def file_url(self):
        if self.dataset.public:
            return settings.FILES_BASE_URL + str(Path(self.path))

    @property
    def json_url(self):
        if self.dataset.public:
            return settings.FILES_BASE_URL + str(Path(self.path).with_suffix('.json'))

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
    def rights_dict(self):
        return RIGHTS.get(self.rights, {})

    @property
    def terms_of_use(self):
        return get_terms_of_use()

    def get_absolute_url(self):
        return reverse('file', kwargs={'pk': self.pk})


class Resource(models.Model):

    id = models.UUIDField(primary_key=True)
    doi = models.TextField()
    title = models.TextField()
    paths = ArrayField(models.TextField())
    datacite = JSONField()

    created = models.DateTimeField()
    updated = models.DateTimeField()

    datasets = models.ManyToManyField(Dataset, related_name='resources')

    class Meta:
        db_table = 'resources'
        managed = False
        ordering = ('doi', )

    def __str__(self):
        return self.doi

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
                rights = filter(lambda item: item.get('rights_uri') == rights_uri, RIGHTS.values())
                if rights:
                    return next(rights)

    @property
    def terms_of_use(self):
        return get_terms_of_use()

    def get_absolute_url(self):
        return reverse('resource', kwargs={'pk': self.pk})


class Tree(models.Model):

    id = models.UUIDField(primary_key=True)
    tree_dict = JSONField()

    created = models.DateTimeField()
    updated = models.DateTimeField()

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

    objects = AttributeManager()

    identifier = models.TextField(primary_key=True)
    specifiers = ArrayField(models.TextField())

    class Meta:
        db_table = 'attributes'
        managed = False
        ordering = ('identifier', )

    def __str__(self):
        return self.identifier
