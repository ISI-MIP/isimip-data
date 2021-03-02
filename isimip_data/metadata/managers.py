from django.db import models


class JSONKeysFunc(models.Func):
    function = 'jsonb_object_keys'


class DatasetQuerySet(models.QuerySet):

    def histogram(self, identifier):
        field = 'specifiers__%s' % identifier
        return self.values_list(field).annotate(count=models.Count(field)).order_by(field)

    def attribute_values(self, identifier):
        field = 'specifiers__%s' % identifier
        return self.values_list(field).annotate(count=models.Count(field)).values_list(field, flat=True).order_by(field)

    def specifiers(self, identifier):
        field = 'specifiers__%s' % identifier
        return self.values_list(field).values_list(field, flat=True).distinct().order_by(field)


class DatasetManager(models.Manager):

    def get_queryset(self):
        return DatasetQuerySet(self.model, using=self._db)


class AttributeQuerySet(models.QuerySet):

    def identifiers(self):
        return self.distinct().values_list('identifier', flat=True)


class AttributeManager(models.Manager):

    def get_queryset(self):
        return AttributeQuerySet(self.model, using=self._db)
