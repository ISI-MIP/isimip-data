import json

from django import forms
from django.contrib import admin
from django.contrib.messages import INFO
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from isimip_data.annotations.models import Download, Figure
from isimip_data.metadata.models import Attribute, Dataset

from .forms import AnnouncementAdminForm
from .mail import (get_caveat_announcement_mail, get_comment_announcement_mail,
                   send_caveat_announcement_mail,
                   send_comment_announcement_mail)
from .models import Caveat, Comment


class CaveatSpecifierWidget(forms.Widget):
    template_name = 'caveats/widgets/caveat_specifier_widget.html'

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['widget']['attributes'] = Attribute.objects.using('metadata').all()
        return context

    def value_from_datadict(self, data, files, name):
        value = {}
        for key, values in data.lists():
            if key.startswith('specifiers_'):
                value[key.replace('specifiers_', '')] = values
        return json.dumps(value)

    def value_omitted_from_data(self, data, files, name):
        return False

    def format_value(self, value):
        if value == 'null':
            return {}
        else:
            data = json.loads(value)
            checked = []
            for key, values in data.items():
                checked += ['id_specifiers_{}_{}'.format(key, value) for value in values]
            return checked


class CaveatAdminForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['specifiers'].widget = CaveatSpecifierWidget()
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


class CaveatAdmin(admin.ModelAdmin):
    form = CaveatAdminForm
    inlines = [FigureInline, DownloadInline]

    search_fields = ('title', 'description')
    list_display = ('title', 'created', 'updated', 'severity', 'status', 'public')
    list_filter = ('severity', 'status', 'public')
    readonly_fields = ('created', 'updated', 'affected_datasets')
    exclude = ('datasets', 'figures', 'downloads')

    fieldsets = (
        (None, {
            'fields': ('public', 'email', 'title', 'description', 'creator', 'severity', 'status', 'subscribers')
        }),
        ('Specifiers', {
            'classes': ('collapse',),
            'fields': ('specifiers', ),
        }),
        ('Versions', {
            'classes': ('collapse',),
            'fields': ('version_after', 'version_before'),
        }),
        ('Datasets', {
            'classes': ('collapse',),
            'fields': ('affected_datasets', ),
        })
    )

    def get_urls(self):
        view = self.admin_site.admin_view(self.caveats_caveat_send)
        return [path('<int:pk>/send/', view, name='caveats_caveat_send')] + super().get_urls()

    def caveats_caveat_send(self, request, pk):
        caveat = get_object_or_404(Caveat, id=pk)

        subject, message = get_caveat_announcement_mail(request, caveat)

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
        datasets = Dataset.objects.using('metadata').filter(id__in=instance.datasets)
        return format_html_join(
            mark_safe('<br>'),
            '{}#{}',
            ((dataset.name, dataset.version) for dataset in datasets)
        )


class CommentAdmin(admin.ModelAdmin):
    search_fields = ('caveat', 'creator', 'text')
    list_display = ('caveat', 'creator', 'created', 'public')
    list_filter = ('public', )
    readonly_fields = ('created', )

    def get_urls(self):
        view = self.admin_site.admin_view(self.caveats_comment_send)
        return [path('<int:pk>/send/', view, name='caveats_comment_send')] + super().get_urls()

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
