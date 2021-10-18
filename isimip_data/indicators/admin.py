from django import forms
from django.contrib import admin
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path
from django.utils.translation import gettext_lazy as _

from isimip_data.annotations.models import Download, Figure, Reference
from isimip_data.annotations.widgets import SpecifierWidget
from isimip_data.annotations.utils import format_affected_datasets

from .models import Indicator, IndicatorValue
from .utils import import_indicator_values


class IndicatorValueAdminForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['specifiers'].widget = SpecifierWidget()
        self.fields['specifiers'].required = False

    class Meta:
        model = IndicatorValue
        fields = '__all__'


class IndicatorUploadAdminForm(forms.Form):

    file = forms.FileField(required=True)

    def __init__(self, *args, **kwargs):
        self.object = kwargs.pop('object')
        super().__init__(*args, **kwargs)


class FigureInline(admin.TabularInline):
    model = Figure.indicators.through
    extra = 0
    verbose_name = _('Figure')
    verbose_name_plural = _('Figures')


class DownloadInline(admin.TabularInline):
    model = Download.indicators.through
    extra = 0
    verbose_name = _('Download')
    verbose_name_plural = _('Downloads')


class ReferenceInline(admin.TabularInline):
    model = Reference.indicators.through
    extra = 0
    verbose_name = _('Reference')
    verbose_name_plural = _('References')


class IndicatorAdmin(admin.ModelAdmin):
    inlines = [FigureInline, DownloadInline, ReferenceInline]

    search_fields = ('title', 'description')
    list_display = ('title', )
    exclude = ('datasets', 'figures', 'downloads', 'references')

    def get_urls(self):
        view = self.admin_site.admin_view(self.indicators_indicator_upload)
        return [path('<int:pk>/upload/', view, name='indicators_indicator_upload')] + super().get_urls()

    def indicators_indicator_upload(self, request, pk):
        indicator = get_object_or_404(Indicator, id=pk)

        form = IndicatorUploadAdminForm(request.POST or None, request.FILES or None, object=indicator)

        if request.method == 'POST':
            if '_back' in request.POST:
                return redirect('admin:indicators_indicator_change', object_id=indicator.id)

            elif '_send' in request.POST and form.is_valid():
                import_indicator_values(indicator, request.FILES['file'])
                return redirect('admin:indicators_indicator_change', object_id=indicator.id)

        return render(request, 'admin/indicators/indicator_upload.html', context={
            'form': form
        })


class IndicatorValueAdmin(admin.ModelAdmin):
    form = IndicatorValueAdminForm

    readonly_fields = ('affected_datasets', )
    search_fields = ('indicator__title', )
    list_filter = ('indicator', )
    list_display = ('indicator', 'specifier_values', 'value')

    fieldsets = (
        (None, {
            'fields': ('indicator', 'value')
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


admin.site.register(Indicator, IndicatorAdmin)
admin.site.register(IndicatorValue, IndicatorValueAdmin)
