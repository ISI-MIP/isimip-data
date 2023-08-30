from django import forms
from django.conf import settings
from django.contrib import admin
from django.contrib.messages import INFO
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path
from django.utils.translation import gettext_lazy as _

from isimip_data.annotations.models import Download, Figure
from isimip_data.annotations.utils import format_affected_datasets, format_affected_resources
from isimip_data.annotations.widgets import SpecifierWidget
from isimip_data.metadata.models import Dataset

from .mail import (
    get_caveat_announcement_mail,
    get_comment_announcement_mail,
    send_caveat_announcement_mail,
    send_comment_announcement_mail,
)
from .models import Caveat, Comment


class CaveatAdminForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['description'].help_text = 'Please describe only the initial problem. Subsequent updates ' \
                                               'should be added as comments. For the information on whether ' \
                                               'the data should be used for simulations or research, use the ' \
                                               'severity field.'
        self.fields['specifiers'].widget = SpecifierWidget()
        self.fields['specifiers'].required = False

    class Meta:
        model = Caveat
        fields = '__all__'


class FigureInline(admin.TabularInline):
    model = Figure.caveats.through
    extra = 0
    verbose_name = _('Figure')
    verbose_name_plural = _('Figures')


class DownloadInline(admin.TabularInline):
    model = Download.caveats.through
    extra = 0
    verbose_name = _('Download')
    verbose_name_plural = _('Downloads')


class AnnouncementAdminForm(forms.Form):
    subject = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'vLargeTextField',
        'rows': 2
    }), required=True)
    message = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'vLargeTextField',
        'rows': 20
    }), required=True)
    recipients = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'vLargeTextField',
        'rows': 4
    }), required=True, help_text=_('You can add multiple recipients line by line.'),
        initial='\n'.join(settings.CAVEATS_DEFAULT_RECIPIENTS))

    def __init__(self, *args, **kwargs):
        self.object = kwargs.pop('object')
        super().__init__(*args, **kwargs)

    def clean_recipients(self):
        recipients = self.cleaned_data['recipients'].splitlines()
        for recipient in recipients:
            validate_email(recipient)
        return recipients

    def clean(self):
        if self.object.email:
            raise ValidationError(_('No email can been send, since the email flag was set before.'))


class CaveatAdmin(admin.ModelAdmin):
    form = CaveatAdminForm
    inlines = [FigureInline, DownloadInline]

    search_fields = ('title', 'description')
    list_display = ('title', 'created', 'updated', 'severity', 'status', 'public')
    list_filter = ('severity', 'status', 'public')
    readonly_fields = ('created', 'updated', 'affected_datasets', 'affected_resources')
    exclude = ('datasets', 'figures', 'downloads')
    filter_vertical = ('subscribers', )

    fieldsets = (
        (None, {
            'fields': ('public', 'email', 'title', 'description', 'creator', 'severity', 'status', 'message')
        }),
        ('Subscribers', {
            'classes': ('collapse',),
            'fields': ('subscribers', ),
        }),
        ('Specifiers', {
            'classes': ('collapse',),
            'fields': ('specifiers', ),
        }),
        ('Versions', {
            'classes': ('collapse',),
            'fields': ('version_after', 'version_before'),
        }),
        ('Include/Exclude', {
            'classes': ('collapse',),
            'fields': ('include', 'exclude'),
        }),
        ('Affected datasets', {
            'classes': ('collapse',),
            'fields': ('affected_datasets', ),
        }),
        ('Affected resources', {
            'classes': ('collapse',),
            'fields': ('affected_resources', ),
        })
    )

    def get_urls(self):
        view = self.admin_site.admin_view(self.caveats_caveat_send)
        return [path('<int:pk>/send/', view, name='caveats_caveat_send'), *super().get_urls()]

    def caveats_caveat_send(self, request, pk):
        caveat = get_object_or_404(Caveat, id=pk)

        datasets = Dataset.objects.using('metadata').filter(target=None, id__in=caveat.datasets)

        subject, message = get_caveat_announcement_mail(request, caveat, datasets)

        form = AnnouncementAdminForm(request.POST or None, object=caveat, initial={
            'subject': subject,
            'message': message
        })

        if request.method == 'POST':
            if '_back' in request.POST:
                return redirect('admin:caveats_caveat_change', object_id=caveat.id)

            elif '_send' in request.POST and form.is_valid():
                caveat.email = True
                caveat.save()

                send_caveat_announcement_mail(form.cleaned_data['subject'],
                                              form.cleaned_data['message'],
                                              form.cleaned_data['recipients'])
                self.message_user(request, 'An email has been send.', level=INFO)
                return redirect('admin:caveats_caveat_change', object_id=caveat.id)

        return render(request, 'admin/caveats/caveat_send.html', context={
            'form': form
        })

    def affected_datasets(self, instance):
        return format_affected_datasets(instance.datasets)

    def affected_resources(self, instance):
        return format_affected_resources(instance.resources)


class CommentAdmin(admin.ModelAdmin):
    search_fields = ('caveat', 'creator', 'text')
    list_display = ('caveat', 'creator', 'created', 'public')
    list_filter = ('public', )
    readonly_fields = ('created', )

    def get_urls(self):
        view = self.admin_site.admin_view(self.caveats_comment_send)
        return [path('<int:pk>/send/', view, name='caveats_comment_send'), *super().get_urls()]

    def caveats_comment_send(self, request, pk):
        comment = get_object_or_404(Comment, id=pk)

        subject, message = get_comment_announcement_mail(request, comment)

        form = AnnouncementAdminForm(request.POST or None, object=comment, initial={
            'subject': subject,
            'message': message
        })

        if request.method == 'POST':
            if '_back' in request.POST:
                return redirect('admin:caveats_comment_change', object_id=comment.id)

            elif '_send' in request.POST and form.is_valid():
                comment.email = True
                comment.save()

                send_comment_announcement_mail(form.cleaned_data['subject'],
                                               form.cleaned_data['message'],
                                               form.cleaned_data['recipients'])
                self.message_user(request, 'An email has been send.', level=INFO)
                return redirect('admin:caveats_comment_change', object_id=comment.id)

        return render(request, 'admin/caveats/comment_send.html', context={
            'form': form
        })


admin.site.register(Caveat, CaveatAdmin)
admin.site.register(Comment, CommentAdmin)
