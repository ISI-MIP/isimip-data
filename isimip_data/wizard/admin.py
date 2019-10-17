from django.contrib import admin
from adminsortable2.admin import SortableAdminMixin

from .models import Layer


@admin.register(Layer)
class LayerAdmin(SortableAdminMixin, admin.ModelAdmin):
    pass
