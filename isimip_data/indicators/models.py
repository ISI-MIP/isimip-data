from django.contrib.postgres.fields import ArrayField
from django.core.cache import cache
from django.db import models
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _

from isimip_data.annotations.models import Download, Figure, Reference
from isimip_data.annotations.utils import query_datasets
from isimip_data.core.models import JsonObjectKeys
from isimip_data.metadata.utils import get_search_url, prettify_identifiers, prettify_specifiers


class Indicator(models.Model):

    title = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    minimum = models.FloatField(
        default=0,
        help_text=_('The minimum value for the scale visualization of this indicator.')
    )
    maximum = models.FloatField(
        default=1,
        help_text=_('The maximum value for the scale visualization of this indicator.')
    )
    reverse = models.BooleanField(
        default=False,
        help_text=_('Designates whether the values of this indicator should be ordered from small to large.')
    )
    figures = models.ManyToManyField(Figure, related_name='indicators')
    downloads = models.ManyToManyField(Download, related_name='indicators')
    references = models.ManyToManyField(Reference, related_name='indicators')

    class Meta:
        ordering = ('title', )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        cache.clear()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.clear()
        super().delete(*args, **kwargs)

    @cached_property
    def table(self):
        identifiers = self.values.annotate(specifier_keys=JsonObjectKeys('specifiers')) \
                                 .values_list('specifier_keys', flat=True).distinct().order_by('specifier_keys')

        pretty_identifiers = prettify_identifiers(identifiers)
        rows = []
        for value in self.values.all():
            specifiers = {identifier: value.specifiers.get(identifier) for identifier in identifiers}
            pretty_specifiers = prettify_specifiers(specifiers, identifiers)

            rows.append({
                'specifiers': specifiers,
                'pretty_specifiers': pretty_specifiers,
                'value': value.value,
                'search_url': get_search_url(specifiers, identifiers)
            })

        return {
            'identifiers': list(identifiers),
            'pretty_identifiers': pretty_identifiers,
            'rows': rows,
            'minimum': self.minimum,
            'maximum': self.maximum,
            'reverse': self.reverse
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
        return f'{self.indicator.title} [{self.specifier_values}]'

    @property
    def specifier_values(self):
        return ', '.join(['|'.join(values) for values in self.specifiers.values()])
