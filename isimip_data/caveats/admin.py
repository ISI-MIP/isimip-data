import json

from django import forms
from django.contrib import admin
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from isimip_data.annotations.models import Figure
from isimip_data.metadata.models import Attribute, Dataset

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


class CaveatAdmin(admin.ModelAdmin):
    form = CaveatAdminForm
    inlines = [FigureInline]
    exclude = ('members',)

    search_fields = ('title', 'description')
    list_display = ('title', 'created', 'updated', 'severity', 'status', 'public')
    list_filter = ('severity', 'status', 'public')
    readonly_fields = ('created', 'updated', 'affected_datasets')
    exclude = ('datasets', 'figures')

    fieldsets = (
        (None, {
            'fields': ('public', 'title', 'description', 'creator', 'severity', 'status', 'subscribers')
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


admin.site.register(Caveat, CaveatAdmin)
admin.site.register(Comment, CommentAdmin)
