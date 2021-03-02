from django import forms
from django.contrib import admin

from adminsortable2.admin import SortableAdminMixin
from isimip_data.metadata.models import Attribute

from .models import Facet


class FacetModelForm(forms.ModelForm):

    attribute = forms.ModelChoiceField(queryset=Attribute.objects.using('metadata').distinct()
                                                                 .values_list('identifier', flat=True))

    class Meta:
        model = Facet
        fields = ('title', 'attribute')


@admin.register(Facet)
class FacetAdmin(SortableAdminMixin, admin.ModelAdmin):

    form = FacetModelForm
