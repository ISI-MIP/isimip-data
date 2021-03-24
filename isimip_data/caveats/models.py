from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.urls import reverse
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _

from isimip_data.accounts.utils import get_full_name
from isimip_data.annotations.models import Download, Figure
from isimip_data.metadata.models import ArrayField, Dataset

from .managers import ModerationManager


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

    objects = ModerationManager()

    public = models.BooleanField(default=False)
    email = models.BooleanField(default=False)
    title = models.CharField(max_length=512)
    description = models.TextField()
    creator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='caveats')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    severity = models.TextField(choices=SEVERITY_CHOICES)
    status = models.TextField(choices=STATUS_CHOICES)
    specifiers = JSONField(default=dict)
    datasets = ArrayField(models.UUIDField(), blank=True, default=list)
    version_after = models.CharField(max_length=8, blank=True)
    version_before = models.CharField(max_length=8, blank=True)
    subscribers = models.ManyToManyField(User)
    figures = models.ManyToManyField(Figure, related_name='caveats')
    downloads = models.ManyToManyField(Download, related_name='caveats')

    class Meta:
        ordering = ('-updated', )

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

            if self.version_after:
                queryset = queryset.filter(version__gte=self.version_after)

            if self.version_before:
                queryset = queryset.filter(version__lte=self.version_before)

            self.datasets = list(queryset.values_list('id', flat=True))
        else:
            self.datasets = []

        super().save(*args, **kwargs)

    def get_creator_display(self):
        return get_full_name(self.creator)

    @property
    def severity_color(self):
        return {
            self.SEVERITY_LOW: 'info',
            self.SEVERITY_MEDIUM: 'warning',
            self.SEVERITY_HIGH: 'red',
            self.SEVERITY_CRITICAL: 'dark'
        }.get(self.severity)

    @property
    def status_color(self):
        return {
            self.STATUS_NEW: 'primary',
            self.STATUS_ON_HOLD: 'info',
            self.STATUS_RESOLVED: 'success',
            self.STATUS_WONT_FIX: 'secondary'
        }.get(self.status)

    @cached_property
    def has_downloads(self):
        return self.downloads.exists()

    @cached_property
    def has_figures(self):
        return self.figures.exists()

    def get_absolute_url(self):
        return reverse('caveat', kwargs={'pk': self.pk})

    def get_reply_url(self):
        return reverse('caveat', kwargs={'pk': self.pk}) + '#reply'

    def get_unsubscribe_url(self):
        return reverse('caveat_unsubscribe', kwargs={'pk': self.pk})

    def get_admin_url(self):
        return reverse('admin:caveats_caveat_change', kwargs={'object_id': self.pk})


class Comment(models.Model):

    objects = ModerationManager()

    text = models.TextField()
    public = models.BooleanField(default=False)
    email = models.BooleanField(default=False)
    creator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='comments')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    caveat = models.ForeignKey(Caveat, on_delete=models.CASCADE, related_name='comments')

    class Meta:
        ordering = ('created', )

    def __str__(self):
        return '{} {} {}'.format(self.caveat, self.creator, self.created)

    def get_creator_display(self):
        return get_full_name(self.creator)

    def get_absolute_url(self):
        return reverse('caveat', args=[self.caveat.id]) + '#comment-{}'.format(self.id)
