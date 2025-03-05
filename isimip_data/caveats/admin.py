from django import forms
from django.conf import settings
from django.contrib import admin
from django.contrib.messages import INFO
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.shortcuts import get_object_or_404, redirect, render
from django.template.loader import render_to_string
from django.urls import path
from django.utils.translation import gettext_lazy as _

from isimip_data.annotations.models import Download, Figure
from isimip_data.annotations.utils import format_affected_datasets, format_affected_resources
from isimip_data.annotations.widgets import SpecifierWidget
from isimip_data.core.mail import send_mail
from isimip_data.metadata.models import Dataset

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
    list_display = ('id', 'title', 'created', 'updated', 'category', 'severity', 'status', 'public', 'email')
    list_display_links = ('id', 'title')
    list_filter = ('category', 'severity', 'status', 'public')
    readonly_fields = ('created', 'updated', 'affected_datasets', 'affected_resources')
    exclude = ('datasets', 'figures', 'downloads')

    fieldsets = (
        (None, {
            'fields': ('public', 'email', 'title', 'description', 'creator', 'category',
                       'severity', 'status', 'message')
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

        context = {
            'caveat': caveat,
            'caveat_url': request.build_absolute_uri(caveat.get_absolute_url()),
            'datasets': datasets
        }

        subject = render_to_string('caveats/email/caveat_announcement_subject.txt', context, request=request)
        message = render_to_string('caveats/email/caveat_announcement_message.txt', context, request=request)

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

                for recipient in form.cleaned_data['recipients']:
                    send_mail(form.cleaned_data['subject'], form.cleaned_data['message'],
                              to=[recipient], reply_to=settings.CAVEATS_REPLY_TO)

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
    list_display = ('id', 'caveat', 'creator', 'created', 'public', 'email')
    list_display_links = ('id', 'caveat')
    list_filter = ('public', )
    readonly_fields = ('created', )

    def get_urls(self):
        view = self.admin_site.admin_view(self.caveats_comment_send)
        return [path('<int:pk>/send/', view, name='caveats_comment_send'), *super().get_urls()]

    def caveats_comment_send(self, request, pk):
        comment = get_object_or_404(Comment, id=pk)

        quotes = []
        level = 0
        for previous_comment in comment.caveat.comments.exclude(created__gte=comment.created) \
                                                      .order_by('created'):
            quotes.append(previous_comment.get_quote(level=level))
            level += 1
        quotes.append(comment.caveat.get_quote(level=level))

        context = {
            'comment': comment,
            'caveat_url': request.build_absolute_uri(comment.get_absolute_url()),
            'quotes': quotes
        }

        subject = render_to_string('caveats/email/comment_announcement_subject.txt', context, request=request)
        message = render_to_string('caveats/email/comment_announcement_message.txt', context, request=request)

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

                for recipient in form.cleaned_data['recipients']:
                    send_mail(form.cleaned_data['subject'], form.cleaned_data['message'],
                              to=[recipient], reply_to=settings.CAVEATS_REPLY_TO)

                self.message_user(request, 'An email has been send.', level=INFO)
                return redirect('admin:caveats_comment_change', object_id=comment.id)

        return render(request, 'admin/caveats/comment_send.html', context={
            'form': form
        })


admin.site.register(Caveat, CaveatAdmin)
admin.site.register(Comment, CommentAdmin)
