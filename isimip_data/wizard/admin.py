from django import forms
from django.contrib import admin
from adminsortable2.admin import SortableAdminMixin

from isimip_data.metadata.models import Attribute

from .models import Layer


class LayerModelForm(forms.ModelForm):

    attribute = forms.ModelChoiceField(queryset=Attribute.objects.using('metadata').all())

    class Meta:
        model = Layer
        fields = ('title', 'attribute')


@admin.register(Layer)
class LayerAdmin(SortableAdminMixin, admin.ModelAdmin):

    form = LayerModelForm
