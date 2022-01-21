from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.urls import reverse
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _

from isimip_data.accounts.utils import get_full_name
from isimip_data.annotations.models import Download, Figure
from isimip_data.annotations.utils import query_datasets
from isimip_data.metadata.utils import prettify_specifiers

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
    SEVERITY_REPLACED = 'replaced'
    SEVERITY_CHOICES = (
        (SEVERITY_LOW, _('low')),
        (SEVERITY_MEDIUM, _('medium')),
        (SEVERITY_HIGH, _('high')),
        (SEVERITY_CRITICAL, _('critical')),
        (SEVERITY_REPLACED, _('replaced')),
    )

    objects = ModerationManager()

    public = models.BooleanField(
        default=False,
        help_text=_('Designates whether this caveat is publicly visible.')
    )
    email = models.BooleanField(
        default=False,
        help_text=_('Designates whether an announcement mail for this caveat has been send.')
    )
    title = models.CharField(max_length=512)
    description = models.TextField()
    creator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='caveats')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    severity = models.TextField(choices=SEVERITY_CHOICES)
    status = models.TextField(choices=STATUS_CHOICES)
    specifiers = models.JSONField(default=dict)
    datasets = ArrayField(models.UUIDField(), blank=True, default=list)
    version_after = models.CharField(max_length=8, blank=True)
    version_before = models.CharField(max_length=8, blank=True)
    subscribers = models.ManyToManyField(User, blank=True)
    figures = models.ManyToManyField(Figure, related_name='caveats')
    downloads = models.ManyToManyField(Download, related_name='caveats')

    class Meta:
        ordering = ('-updated', )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.datasets = query_datasets(self.specifiers, self.version_after, self.version_before)
        super().save(*args, **kwargs)

    def get_creator_display(self):
        return get_full_name(self.creator)

    @property
    def severity_level(self):
        {
            self.SEVERITY_LOW: 1,
            self.SEVERITY_MEDIUM: 2,
            self.SEVERITY_HIGH: 3,
            self.SEVERITY_CRITICAL: 4,
            self.SEVERITY_REPLACED: 5
        }.get(self.severity)

    @property
    def severity_color(self):
        return {
            self.SEVERITY_LOW: 'info',
            self.SEVERITY_MEDIUM: 'warning',
            self.SEVERITY_HIGH: 'danger',
            self.SEVERITY_CRITICAL: 'dark',
            self.SEVERITY_REPLACED: 'success'
        }.get(self.severity)

    @property
    def severity_message(self):
        if self.severity == self.SEVERITY_LOW:
            return 'The affected datasets can still be used.'
        elif self.severity == self.SEVERITY_MEDIUM:
            return 'The affected datasets can still be used. Please note the limitations described in the caveat.'
        elif self.severity in [self.SEVERITY_HIGH, self.SEVERITY_CRITICAL]:
            return 'This dataset should not be used until this caveat is resolved.'
        elif self.severity in [self.SEVERITY_REPLACED]:
            return 'Please use the replaced datasets for new simulations or research.'

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

    @cached_property
    def pretty_specifiers(self):
        return prettify_specifiers(self.specifiers, self.specifiers.keys())

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

    public = models.BooleanField(
        default=False,
        help_text=_('Designates whether this comment is publicly visible.')
    )
    email = models.BooleanField(
        default=False,
        help_text=_('Designates whether an announcement mail for this comment has been send.')
    )
    text = models.TextField()
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
