from django.contrib import admin

from .models import Figure


class FigureAdmin(admin.ModelAdmin):
    search_fields = ('title', 'caption', 'credits')
    list_display = ('title', )


admin.site.register(Figure, FigureAdmin)
