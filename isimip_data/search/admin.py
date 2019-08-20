from django.contrib import admin
from adminsortable2.admin import SortableAdminMixin

from .models import Facet


@admin.register(Facet)
class FacetAdmin(SortableAdminMixin, admin.ModelAdmin):
    pass
