from django.db import models


class JSONKeysFunc(models.Func):
    function = 'jsonb_object_keys'


class DatasetQuerySet(models.QuerySet):

    def attributes(self):
        return self.annotate(keys=JSONKeysFunc('attributes')).order_by().values_list('keys', flat=True).distinct()

    def histogram(self, attribute):
        field = 'attributes__%s' % attribute
        return self.values_list(field).annotate(count=models.Count(field)).order_by(field)


class DatasetManager(models.Manager):

    def get_queryset(self):
        return DatasetQuerySet(self.model, using=self._db)
