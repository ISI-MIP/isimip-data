import textwrap

from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.core.cache import cache
from django.db import models
from django.urls import reverse
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _

from isimip_data.annotations.models import Download, Figure
from isimip_data.annotations.utils import query_datasets, query_resources
from isimip_data.core.utils import get_full_name
from isimip_data.metadata.utils import prettify_specifiers

from .managers import ModerationManager


class Caveat(models.Model):

    CATEGORY_NOTE = 'note'
    CATEGORY_ISSUE = 'issue'
    CATEGORY_CHOICES = (
        (CATEGORY_NOTE, _('note')),
        (CATEGORY_ISSUE, _('issue'))
    )

    SEVERITY_LOW = 'low'
    SEVERITY_HIGH = 'high'
    SEVERITY_CHOICES = (
        (SEVERITY_LOW, _('low')),
        (SEVERITY_HIGH, _('high'))
    )

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

    MESSAGE_CAN_BE_USED = 'can_be_used'
    MESSAGE_DO_NOT_USE = 'do_not_use'
    MESSAGE_REPLACED = 'replaced'
    MESSAGE_CHOICES = (
        (MESSAGE_CAN_BE_USED, _('Affected datasets can still be used for simulations or research.')),
        (MESSAGE_DO_NOT_USE, _('Affected datasets should not be used until this caveat is resolved.')),
        (MESSAGE_REPLACED, _('Please use the replaced datasets for new simulations or research.'))
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
    category = models.TextField(choices=CATEGORY_CHOICES, default=CATEGORY_ISSUE)
    severity = models.TextField(blank=True, choices=SEVERITY_CHOICES, default=SEVERITY_LOW)
    status = models.TextField(blank=True, choices=STATUS_CHOICES, default=STATUS_NEW)
    message = models.TextField(blank=True, choices=MESSAGE_CHOICES)
    specifiers = models.JSONField(default=dict)
    include = models.TextField(
        blank=True,
        help_text='You can add multiple paths line by line. If paths are provided, datasets will '
                  'only be included if their path starts with one of the paths given.')
    exclude = models.TextField(
        blank=True,
        help_text='You can add multiple paths line by line. Datasets will be excluded '
                  'if their path starts with one of the paths given.')
    datasets = ArrayField(models.UUIDField(), blank=True, default=list)
    resources = ArrayField(models.UUIDField(), blank=True, default=list)
    version_after = models.CharField(max_length=8, blank=True)
    version_before = models.CharField(max_length=8, blank=True)
    figures = models.ManyToManyField(Figure, related_name='caveats')
    downloads = models.ManyToManyField(Download, related_name='caveats')

    class Meta:
        ordering = ('-created', )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.datasets = query_datasets(self.specifiers, self.version_after, self.version_before,
                                       self.include, self.exclude)
        self.resources = query_resources(self.datasets)
        cache.clear()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # cache.clear()
        super().delete(*args, **kwargs)

    def get_creator_display(self):
        return get_full_name(self.creator)

    @property
    def category_color(self):
        return {
            self.CATEGORY_NOTE: 'light',
            self.CATEGORY_ISSUE: 'dark'
        }.get(self.category)

    @property
    def severity_level(self):
        return {
            self.SEVERITY_LOW: 1,
            self.SEVERITY_HIGH: 2
        }.get(self.severity)

    @property
    def severity_color(self):
        return {
            self.SEVERITY_LOW: 'info',
            self.SEVERITY_HIGH: 'danger'
        }.get(self.severity)

    @property
    def status_color(self):
        return {
            self.STATUS_NEW: 'primary',
            self.STATUS_ON_HOLD: 'info',
            self.STATUS_RESOLVED: 'success',
            self.STATUS_WONT_FIX: 'secondary'
        }.get(self.status)

    @property
    def message_color(self):
        return self.severity_color

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

    def get_admin_url(self):
        return reverse('admin:caveats_caveat_change', kwargs={'object_id': self.pk})

    def get_search_url(self):
        query = 'all/true/'

        if self.version_before:
            query += f'before/{self.version_before}/'

        if self.version_after:
            query += f'after/{self.version_after}/'

        for key, values in self.specifiers.items():
            for value in values:
                query += f'{key}/{value}/'

        return reverse('search') + query

    def get_quote_string(self, level):
        head_indent = '> ' * level if level else ''
        text_indent = '> ' * (level + 1)
        return f'{head_indent}On {self.created.strftime("%B %d, %Y")}, {self.get_creator_display()} reported:\n' \
            + textwrap.fill(self.description, width=70,
                            initial_indent=text_indent, subsequent_indent=text_indent) + '\n'


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
        return f'{self.caveat} {self.creator} {self.created}'

    def get_creator_display(self):
        return get_full_name(self.creator)

    def get_absolute_url(self):
        return reverse('caveat', args=[self.caveat.id]) + f'#comment-{self.id}'

    def get_quote_string(self, level):
        head_indent = '> ' * level if level else ''
        text_indent = '> ' * (level + 1)
        return f'{head_indent}On {self.created.strftime("%B %d, %Y")}, {self.get_creator_display()} commented:\n' \
            + textwrap.fill(self.text, width=70,
                            initial_indent=text_indent, subsequent_indent=text_indent) + '\n'
