from django.contrib.sitemaps import Sitemap
from django.db.models.functions import Greatest

from .models import Dataset, File, Resource


class DatasetSitemap(Sitemap):
    changefreq = 'never'
    limit = 50_000

    def items(self):
        return (
            Dataset.objects
            .using('metadata')
            .order_by('id')
            .annotate(last_changed=Greatest('created', 'updated', 'published', 'archived'))
            .values('id', 'last_changed')
        )

    def lastmod(self, obj):
        return obj['last_changed']

    def location(self, obj):
        return f'/datasets/{obj["id"]}/'


class FileSitemap(Sitemap):
    changefreq = 'never'
    limit = 50_000

    def items(self):
        return (
            File.objects
            .using('metadata')
            .order_by('id')
            .annotate(last_changed=Greatest('created', 'updated'))
            .values('id', 'last_changed')
        )

    def lastmod(self, obj):
        return obj['last_changed']

    def location(self, obj):
        return f'/files/{obj["id"]}/'


class ResourceSitemap(Sitemap):
    changefreq = 'never'
    limit = 50_000

    def items(self):
        return (
            Resource.objects
            .using('metadata')
            .order_by('id')
            .annotate(last_changed=Greatest('created', 'updated'))
            .values('id', 'doi', 'last_changed')
        )

    def lastmod(self, obj):
        return obj['last_changed']

    def location(self, obj):
        return f'/{obj["doi"]}/'
