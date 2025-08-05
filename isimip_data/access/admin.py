from django import forms
from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import Resource, Token


class PathsField(forms.Field):
    widget = forms.Textarea

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('required', False)
        super().__init__(*args, **kwargs)

    def to_python(self, value):
        if not value:
            return []
        return [item.strip() for item in value.strip().split('\n') if item.strip()]

    def prepare_value(self, value):
        if isinstance(value, list):
            return '\n'.join(value)
        return value


class ResourceForm(forms.ModelForm):
    paths = PathsField()

    class Meta:
        model = Resource
        fields = '__all__'


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    form = ResourceForm
    list_display_links = ('id', 'title')
    list_display = ('id', 'title', 'paths', 'created')


@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display_links = ('id', 'subject')
    list_display = ('id', 'subject', 'resource', 'created')
    readonly_fields =  ('created', 'updated', 'as_json_pre', 'as_jwt_pre')

    def as_json_pre(self, obj):
        return mark_safe(f'<pre>{obj.as_json}</pre>')

    as_json_pre.short_description = 'JSON'

    def as_jwt_pre(self, obj):
        return mark_safe(f'<pre style="width: 600px;">{obj.as_jwt}</pre>')

    as_jwt_pre.short_description = 'JWT'
