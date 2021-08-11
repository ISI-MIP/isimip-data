from django.contrib.sitemaps import Sitemap
from .models import Caveat


class CaveatSitemap(Sitemap):
    changefreq = 'daily'

    def items(self):
        return Caveat.objects.all()

    def lastmod(self, obj):
        return obj.updated
