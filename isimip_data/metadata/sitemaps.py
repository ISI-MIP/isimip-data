from django.contrib.sitemaps import Sitemap

from .models import Dataset, File, Resource


class DatasetSitemap(Sitemap):
    changefreq = 'weekly'
    limit = 1000

    def items(self):
        return Dataset.objects.using('metadata').all()

    def lastmod(self, obj):
        dates = [date for date in [obj.created, obj.updated, obj.published, obj.archived] if date is not None]
        return max(dates) if dates else None


class FileSitemap(Sitemap):
    changefreq = 'weekly'
    limit = 1000

    def items(self):
        return File.objects.using('metadata').all()

    def lastmod(self, obj):
        dates = [date for date in [obj.created, obj.updated] if date is not None]
        return max(dates) if dates else None


class ResourceSitemap(Sitemap):
    changefreq = 'weekly'

    def items(self):
        return Resource.objects.using('metadata').all()

    def lastmod(self, obj):
        dates = [date for date in [obj.created, obj.updated] if date is not None]
        return max(dates) if dates else None
