from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps import Sitemap
from django.contrib.sitemaps import views as sitemaps_views
from django.urls import include, path, re_path, reverse
from django.views.generic.base import TemplateView

from rest_framework import routers

from isimip_data.access.views import access, token
from isimip_data.access.viewsets import AccessViewSet
from isimip_data.caveats.sitemaps import CaveatSitemap
from isimip_data.caveats.views import caveat, caveats
from isimip_data.caveats.viewsets import CategoryViewSet, CaveatViewSet, SeverityViewSet, StatusViewSet
from isimip_data.core.viewsets import SettingsViewSet
from isimip_data.download.views import download
from isimip_data.download.viewsets import CountryViewSet
from isimip_data.home.views import home
from isimip_data.metadata.sitemaps import DatasetSitemap, FileSitemap, ResourceSitemap
from isimip_data.metadata.views import (
    dataset,
    file,
    identifier,
    identifiers,
    metadata,
    resource,
    resource_bibtex,
    resource_json,
    resource_xml,
    resources,
)
from isimip_data.metadata.viewsets import (
    DatasetViewSet,
    FileViewSet,
    GlossaryViewSet,
    IdentifierViewSet,
    ResourceViewSet,
    TreeViewSet,
)
from isimip_data.search.views import search
from isimip_data.search.viewsets import FacetViewSet

router = routers.DefaultRouter()
router.register(r'datasets', DatasetViewSet, basename='dataset')
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'glossary', GlossaryViewSet, basename='glossary')
router.register(r'tree', TreeViewSet, basename='tree')
router.register(r'files', FileViewSet, basename='file')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'identifiers', IdentifierViewSet, basename='identifier')
router.register(r'facets', FacetViewSet, basename='facet')
router.register(r'caveats', CaveatViewSet, basename='caveat')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'status', StatusViewSet, basename='status')
router.register(r'severities', SeverityViewSet, basename='severity')
router.register(r'settings', SettingsViewSet, basename='setting')
router.register(r'access', AccessViewSet, basename='access')

class StaticSitemap(Sitemap):

    def items(self):
        return [
            'metadata',
            'resources',
            'search',
            'download',
            'issues-and-notes',
            'caveats',  # legacy
            'home'
        ]

    def location(self, item):
        return reverse(item)


sitemaps = {
    'static': StaticSitemap,
    'issues-and-notes': CaveatSitemap,
    'caveats': CaveatSitemap,
    'datasets': DatasetSitemap,
    'files': FileSitemap,
    'resources': ResourceSitemap
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),

    path('metadata/', metadata, name='metadata'),
    path('doi/', resources, name='resources'),

    path('datasets/<uuid:pk>/', dataset, name='dataset'),
    path('files/<uuid:pk>/', file, name='file'),
    path('resources/<uuid:pk>/', resource, name='resource'),

    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).bib', resource_bibtex, name='resource_bibtex'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).xml', resource_xml, name='resource_xml'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).json', resource_json, name='resource_json'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+)', resource, name='resource'),

    path('identifiers/', identifiers, name='identifiers'),
    path('identifiers/<str:identifier>', identifier, name='identifier'),

    path('search/', search, name='search'),
    path('search/<path:path>/', search, name='search'),

    path('download/', download, name='download'),
    path('download/<str:job_id>/', download, name='download'),

    path('issues-and-notes/', caveats, name='issues_and_notes'),
    path('caveats/', caveats, name='caveats'),  # legacy

    path('issues/<int:pk>/', caveat, name='issue'),
    path('notes/<int:pk>/', caveat, name='note'),
    path('caveats/<int:pk>/', caveat, name='caveat'),  # legacy

    path('access/token/<str:jwt>/', token, name='token'),
    path('access/<path:path>/', access, name='access'),

    path('', home, name='home'),
    path('robots.txt', TemplateView.as_view(template_name='core/robots.txt'), name='robots.txt'),

    path('sitemap.xml', sitemaps_views.index, {'sitemaps': sitemaps}),
    path('sitemap-<section>.xml', sitemaps_views.sitemap, {'sitemaps': sitemaps},
         name='django.contrib.sitemaps.views.sitemap')
]

handler400 = 'isimip_data.core.views.bad_request'
handler403 = 'isimip_data.core.views.forbidden'
handler404 = 'isimip_data.core.views.not_found'
handler500 = 'isimip_data.core.views.internal_server_error'

if settings.DEBUG_TOOLBAR:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
        *urlpatterns,
        *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    ]
