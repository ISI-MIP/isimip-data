from django.contrib.sitemaps import Sitemap

from .models import Dataset, File, Resource


class DatasetSitemap(Sitemap):
    changefreq = 'never'
    limit = 10_000

    def items(self):
        return Dataset.objects.using('metadata').order_by('id').only('id', 'last_changed')

    def lastmod(self, obj):
        return obj.last_changed


class FileSitemap(Sitemap):
    changefreq = 'never'
    limit = 10_000

    def items(self):
        return File.objects.using('metadata').order_by('id').only('id', 'last_changed')

    def lastmod(self, obj):
        return obj.last_changed


class ResourceSitemap(Sitemap):
    changefreq = 'never'
    limit = 10_000

    def items(self):
        return Resource.objects.using('metadata').order_by('id').only('id', 'last_changed')

    def lastmod(self, obj):
        return obj.last_changed
