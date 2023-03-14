from django.db import models


class DatasetQuerySet(models.QuerySet):

    def histogram(self, identifier):
        field = 'specifiers__%s' % identifier
        return self.values_list(field).annotate(count=models.Count(field)).order_by(field)


class DatasetManager(models.Manager):

    def get_queryset(self):
        return DatasetQuerySet(self.model, using=self._db)


class IdentifierQuerySet(models.QuerySet):

    def identifiers(self):
        return self.distinct().values_list('identifier', flat=True)


class IdentifierManager(models.Manager):

    def get_queryset(self):
        return IdentifierQuerySet(self.model, using=self._db)
