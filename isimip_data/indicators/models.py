from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.functional import cached_property

from isimip_data.core.models import JsonObjectKeys
from isimip_data.annotations.models import Download, Figure, Reference
from isimip_data.annotations.utils import query_datasets


class Indicator(models.Model):

    title = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    figures = models.ManyToManyField(Figure, related_name='indicators')
    downloads = models.ManyToManyField(Download, related_name='indicators')
    references = models.ManyToManyField(Reference, related_name='indicators')

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title

    @cached_property
    def table(self):
        columns = self.values.annotate(specifier_keys=JsonObjectKeys('specifiers')) \
                             .values_list('specifier_keys', flat=True).distinct().order_by('specifier_keys')
        return {
            'columns': columns,
            'rows': [
                {
                    'specifiers': [value.specifiers.get(column) for column in columns],
                    'value': value.value
                } for value in self.values.order_by('-value')
            ]
        }


class IndicatorValue(models.Model):

    value = models.FloatField()
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE, related_name='values')
    specifiers = models.JSONField(default=dict)
    version_after = models.CharField(max_length=8, blank=True)
    version_before = models.CharField(max_length=8, blank=True)
    datasets = ArrayField(models.UUIDField(), blank=True, default=list)

    def save(self, *args, **kwargs):
        self.datasets = query_datasets(self.specifiers, self.version_after, self.version_before)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ('indicator', )

    def __str__(self):
        return self.indicator.title

    @property
    def specifier_values(self):
        return ', '.join(['|'.join(values) for values in self.specifiers.values()])
