from django.contrib.sitemaps import Sitemap
from .models import Dataset, File, Resource


class DatasetSitemap(Sitemap):
    changefreq = 'monthly'

    def items(self):
        return Dataset.objects.using('metadata').all()

    def lastmod(self, obj):
        return max([date for date in [obj.created, obj.updated, obj.published, obj.archived] if date is not None])


class FileSitemap(Sitemap):
    changefreq = 'monthly'

    def items(self):
        return File.objects.using('metadata').all()

    def lastmod(self, obj):
        return max([date for date in [obj.created, obj.updated] if date is not None])


class ResourceSitemap(Sitemap):
    changefreq = 'monthly'

    def items(self):
        return Resource.objects.using('metadata').all()

    def lastmod(self, obj):
        return max([date for date in [obj.created, obj.updated] if date is not None])
