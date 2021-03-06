import json
import textwrap

from django.contrib import admin
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe

from .models import Dataset, File, Resource


class ReadOnlyMixin(object):
    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class DatasetAdmin(ReadOnlyMixin, admin.ModelAdmin):
    search_fields = ('path', )
    list_display = ('path', 'size', 'version', 'created', 'updated', 'public')
    list_filter = ('version', 'public')

    readonly_fields = ('specifiers_json', )
    exclude = ('specifiers', )

    def get_queryset(self, request):
        return Dataset.objects.using('metadata')

    def specifiers_json(self, instance):
        lines = [
            textwrap.fill(l, 80) for l in json.dumps(instance.specifiers, indent=2).splitlines()
        ]
        return mark_safe('<pre>%s</pre>' % '\n'.join(lines))


class FilesAdmin(ReadOnlyMixin, admin.ModelAdmin):
    search_fields = ('path', )
    list_display = ('path', 'size', 'version', 'created', 'updated')

    readonly_fields = ('specifiers_json', )
    exclude = ('specifiers', )

    def get_queryset(self, request):
        return File.objects.using('metadata')

    def specifiers_json(self, instance):
        lines = [
            textwrap.fill(l, 80) for l in json.dumps(instance.specifiers, indent=2).splitlines()
        ]
        return mark_safe('<pre>%s</pre>' % '\n'.join(lines))


class ResourceAdmin(ReadOnlyMixin, admin.ModelAdmin):
    search_fields = ('doi', 'paths')
    list_display = ('doi', 'paths', 'created', 'updated')

    readonly_fields = ('datacite_json', 'datasets_list')
    exclude = ('datacite', 'datasets')

    def get_queryset(self, request):
        return Resource.objects.using('metadata')

    def datacite_json(self, instance):
        lines = [
            textwrap.fill(l, 80) for l in json.dumps(instance.datacite, indent=2).splitlines()
        ]
        return mark_safe('<pre>%s</pre>' % '\n'.join(lines))

    def datasets_list(self, instance):
        return format_html_join(
            mark_safe('<br>'),
            '{}#{}',
            ((dataset.name, dataset.version) for dataset in instance.datasets.all())
        )


admin.site.register(Dataset, DatasetAdmin)
admin.site.register(File, FilesAdmin)
admin.site.register(Resource, ResourceAdmin)
