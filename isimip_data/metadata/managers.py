from django.db import models


class DatasetQuerySet(models.QuerySet):

    def histogram(self, attribute):
        field = 'attributes__%s' % attribute
        return self.values_list(field).annotate(count=models.Count(field)).order_by(field)


class DatasetManager(models.Manager):

    def get_queryset(self):
        return DatasetQuerySet(self.model, using=self._db)
