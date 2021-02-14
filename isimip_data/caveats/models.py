from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils.translation import gettext_lazy as _

from isimip_data.accounts.utils import get_full_name
from isimip_data.metadata.models import ArrayField, Dataset


class Caveat(models.Model):

    STATUS_NEW = 'new'
    STATUS_ON_HOLD = 'on_hold'
    STATUS_RESOLVED = 'resolved'
    STATUS_WONT_FIX = 'wont_fix'
    STATUS_CHOICES = (
        (STATUS_NEW, _('new')),
        (STATUS_ON_HOLD, _('on hold')),
        (STATUS_RESOLVED, _('resolved')),
        (STATUS_WONT_FIX, _('won\'t fix')),
    )

    SEVERITY_LOW = 'low'
    SEVERITY_MEDIUM = 'medium'
    SEVERITY_HIGH = 'high'
    SEVERITY_CRITICAL = 'critical'
    SEVERITY_CHOICES = (
        (SEVERITY_LOW, _('low')),
        (SEVERITY_MEDIUM, _('medium')),
        (SEVERITY_HIGH, _('high')),
        (SEVERITY_CRITICAL, _('critical')),
    )

    title = models.CharField(max_length=512)
    description = models.TextField()
    creator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='issues')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    severity = models.TextField(choices=SEVERITY_CHOICES)
    status = models.TextField(choices=STATUS_CHOICES)
    specifiers = JSONField(default=dict)
    datasets = ArrayField(models.UUIDField(), blank=True, default=list)

    class Meta:
        ordering = ('updated', )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.specifiers:
            queryset = Dataset.objects.using('metadata')
            for identifier, specifiers in self.specifiers.items():
                q = models.Q()
                for specifier in specifiers:
                    q |= models.Q(specifiers__contains={identifier: specifier})
                queryset = queryset.filter(q)

            self.datasets = list(queryset.values_list('id', flat=True))
        else:
            self.datasets = []

        super().save(*args, **kwargs)

    def get_creator_display(self):
        return get_full_name(self.creator)
