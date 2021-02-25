from django.contrib import admin

from .models import Download, Figure


class DownloadAdmin(admin.ModelAdmin):
    search_fields = ('title', )
    list_display = ('title', )


class FigureAdmin(admin.ModelAdmin):
    search_fields = ('title', 'caption', 'credits')
    list_display = ('title', )


admin.site.register(Download, DownloadAdmin)
admin.site.register(Figure, FigureAdmin)
