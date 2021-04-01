from django import forms
from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Annotation, Download, Figure
from .utils import format_affected_datasets
from .widgets import SpecifierWidget


class AnnotationAdminForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['specifiers'].widget = SpecifierWidget()
        self.fields['specifiers'].required = False

    class Meta:
        model = Annotation
        fields = '__all__'


class FigureInline(admin.TabularInline):
    model = Figure.annotations.through
    extra = 0
    verbose_name = _('Figure')
    verbose_name_plural = _('Figures')


class DownloadInline(admin.TabularInline):
    model = Download.annotations.through
    extra = 0
    verbose_name = _('Download')
    verbose_name_plural = _('Downloads')


class AnnotationAdmin(admin.ModelAdmin):
    form = AnnotationAdminForm
    inlines = [FigureInline, DownloadInline]

    search_fields = ('title', )
    list_display = ('title', )
    readonly_fields = ('affected_datasets', )
    exclude = ('datasets', 'figures', 'downloads')

    search_fields = ('title', )
    list_display = ('title', )

    fieldsets = (
        (None, {
            'fields': ('title', )
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
        return format_affected_datasets(instance.datasets)


class DownloadAdmin(admin.ModelAdmin):
    search_fields = ('title', )
    list_display = ('title', 'created', 'updated')


class FigureAdmin(admin.ModelAdmin):
    search_fields = ('title', 'caption', 'credits')
    list_display = ('title', 'created', 'updated')


admin.site.register(Annotation, AnnotationAdmin)
admin.site.register(Download, DownloadAdmin)
admin.site.register(Figure, FigureAdmin)
