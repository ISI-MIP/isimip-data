from django import forms
from django.contrib import admin

from adminsortable2.admin import SortableAdminMixin
from isimip_data.metadata.models import Identifier

from .models import Facet


class FacetModelForm(forms.ModelForm):

    identifier = forms.ModelChoiceField(queryset=Identifier.objects.using('metadata').distinct()
                                                                   .values_list('identifier', flat=True))

    class Meta:
        model = Facet
        fields = ('title', 'identifier')


@admin.register(Facet)
class FacetAdmin(SortableAdminMixin, admin.ModelAdmin):

    form = FacetModelForm
