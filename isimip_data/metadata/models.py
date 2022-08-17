from datetime import datetime
from pathlib import Path

from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.search import SearchVectorField
from django.db import models
from django.urls import reverse
from django.utils.functional import cached_property

from .constants import RIGHTS
from .managers import AttributeManager, DatasetManager
from .utils import get_terms_of_use, merge_identifiers, merge_specifiers, prettify_specifiers


class Dataset(models.Model):

    objects = DatasetManager()

    id = models.UUIDField(primary_key=True)
    target = models.ForeignKey('Dataset', on_delete=models.CASCADE, related_name='links')

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    size = models.BigIntegerField()
    specifiers = models.JSONField()
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

    @cached_property
    def is_link(self):
        return self.target is not None

    @cached_property
    def is_global(self):
        return self.specifiers.get('region') == 'global'

    @cached_property
    def is_netcdf(self):
        return all([Path(file.path).suffix.startswith('.nc') for file in self.files.all()])

    @cached_property
    def paths(self):
        return [self.path] + [link.path for link in self.links.all()]

    @cached_property
    def pretty_specifiers(self):
        return prettify_specifiers(self.merged_specifiers, self.merged_identifiers)

    @cached_property
    def merged_specifiers(self):
        return merge_specifiers(self)

    @cached_property
    def merged_identifiers(self):
        return merge_identifiers(self)

    @cached_property
    def rights_list(self):
        return [
            RIGHTS.get(self.rights, {})
        ]

    @cached_property
    def terms_of_use(self):
        return get_terms_of_use()

    def get_absolute_url(self):
        return reverse('dataset', kwargs={'pk': self.pk})


class File(models.Model):

    id = models.UUIDField(primary_key=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='files')
    target = models.ForeignKey('File', on_delete=models.CASCADE, related_name='links')

    name = models.TextField()
    path = models.TextField()
    version = models.TextField()
    size = models.BigIntegerField()
    checksum = models.TextField()
    checksum_type = models.TextField()
    netcdf_header = models.JSONField()
    specifiers = models.JSONField()
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

    @cached_property
    def public(self):
        return self.dataset.public

    @cached_property
    def resources(self):
        return self.dataset.resources

    @cached_property
    def json_path(self):
        return str(Path(self.path).with_suffix('.json'))

    @cached_property
    def is_link(self):
        return self.target is not None

    @cached_property
    def is_global(self):
        return self.specifiers.get('region') == 'global'

    @cached_property
    def is_netcdf(self):
        return Path(self.path).suffix.startswith('.nc')

    @cached_property
    def paths(self):
        return [self.path] + [link.path for link in self.links.all()]

    @cached_property
    def pretty_specifiers(self):
        return prettify_specifiers(self.merged_specifiers, self.merged_identifiers)

    @cached_property
    def merged_specifiers(self):
        return merge_specifiers(self)

    @cached_property
    def merged_identifiers(self):
        return merge_identifiers(self)

    @cached_property
    def rights_list(self):
        return [
            RIGHTS.get(self.dataset.rights, {})
        ]

    @cached_property
    def terms_of_use(self):
        return get_terms_of_use()

    def get_absolute_url(self):
        return reverse('file', kwargs={'pk': self.pk})


class Resource(models.Model):

    id = models.UUIDField(primary_key=True)
    doi = models.TextField()
    title = models.TextField()
    version = models.TextField()
    paths = ArrayField(models.TextField())
    datacite = models.JSONField()

    created = models.DateTimeField()
    updated = models.DateTimeField()

    datasets = models.ManyToManyField(Dataset, related_name='resources')

    class Meta:
        db_table = 'resources'
        managed = False
        ordering = ('doi', )

    def __str__(self):
        return self.doi

    @cached_property
    def major_version(self):
        version = self.datacite.get('version')
        if version:
            return '.'.join(version.split('.')[:2])

    @cached_property
    def doi_url(self):
        return 'https://doi.org/{}'.format(self.doi)

    @cached_property
    def title_with_version(self):
        if not self.version or self.title.endswith(')') or self.title[-1].isdigit():
            return self.title
        else:
            return f'{self.title} (v{self.version})'

    @cached_property
    def creators_str(self):
        return ', '.join([creator.get('name', '') for creator in self.datacite.get('creators', [])])

    @cached_property
    def contact_persons(self):
        return [
            contributor for contributor in self.datacite.get('contributors', [])
            if contributor.get('contributorType') == 'ContactPerson'
        ]

    @cached_property
    def publication_date(self):
        date_string = None
        for item in self.datacite.get('dates', []):
            try:
                if item['dateType'] == 'Issued':
                    date_string = item['date']
            except (TypeError, KeyError):
                pass

        if date_string is not None:
            try:
                return datetime.strptime(date_string, '%Y-%m-%d')
            except ValueError:
                return datetime.strptime(date_string, '%Y')

    @cached_property
    def rights_list(self):
        rights_list = []
        for rights in self.datacite.get('rightsList', []):
            rights_uri = rights.get('rightsURI')
            if rights_uri:
                rights = filter(lambda item: item.get('rights_uri') == rights_uri, RIGHTS.values())
                try:
                    rights_list.append(next(rights))
                except StopIteration:
                    pass
        return rights_list

    @cached_property
    def terms_of_use(self):
        return get_terms_of_use()

    def get_absolute_url(self):
        return reverse('resource', kwargs={'doi': self.doi})


class Tree(models.Model):

    id = models.UUIDField(primary_key=True)
    tree_dict = models.JSONField()

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
