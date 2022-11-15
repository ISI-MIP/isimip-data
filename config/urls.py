from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps import Sitemap
from django.contrib.sitemaps import views as sitemaps_views
from django.urls import include, path, re_path, reverse
from django.views.generic.base import TemplateView

from django_datacite.views import resource as datacite_resource
from django_datacite.views import resource_json as datacite_resource_json
from django_datacite.views import resource_xml as datacite_resource_xml
from rest_framework import routers

from isimip_data.accounts.views import (profile_delete, profile_delete_success,
                                        profile_update)
from isimip_data.caveats.sitemaps import CaveatSitemap
from isimip_data.caveats.views import (caveat, caveat_create, caveat_subscribe,
                                       caveat_unsubscribe, caveats,
                                       comment_create, subscriptions)
from isimip_data.caveats.viewsets import CaveatViewSet
from isimip_data.core.viewsets import SettingsViewSet
from isimip_data.download.views import download
from isimip_data.download.viewsets import CountryViewSet
from isimip_data.indicators.views import indicator, indicators
from isimip_data.metadata.sitemaps import (DatasetSitemap, FileSitemap,
                                           ResourceSitemap)
from isimip_data.metadata.views import (attributes, dataset, file, metadata,
                                        resource, resource_bibtex,
                                        resource_json, resource_xml, resources)
from isimip_data.metadata.viewsets import (AttributeViewSet, DatasetViewSet,
                                           FileViewSet, GlossaryViewSet,
                                           ResourceViewSet, TreeViewSet)
from isimip_data.search.views import search
from isimip_data.search.viewsets import FacetViewSet

router = routers.DefaultRouter()
router.register(r'datasets', DatasetViewSet, basename='dataset')
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'glossary', GlossaryViewSet, basename='glossary')
router.register(r'tree', TreeViewSet, basename='tree')
router.register(r'files', FileViewSet, basename='file')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'attributes', AttributeViewSet, basename='attribute')
router.register(r'facets', FacetViewSet, basename='facet')
router.register(r'caveats', CaveatViewSet, basename='caveat')
router.register(r'settings', SettingsViewSet, basename='setting')


class StaticSitemap(Sitemap):

    def items(self):
        return ['metadata', 'resources', 'search', 'download', 'caveats', 'home']

    def location(self, item):
        return reverse(item)


sitemaps = {
    'static': StaticSitemap,
    'caveats': CaveatSitemap,
    'datasets': DatasetSitemap,
    'files': FileSitemap,
    'resources': ResourceSitemap
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),

    path('account/profile/', profile_update, name='profile_update'),
    path('account/profile/delete/', profile_delete, name='profile_delete'),
    path('account/profile/delete/success/', profile_delete_success, name='profile_delete_success'),
    path('account/', include('allauth.urls')),

    path('metadata/', metadata, name='metadata'),
    path('doi/', resources, name='resources'),

    path('datasets/<uuid:pk>/', dataset, name='dataset'),
    path('files/<uuid:pk>/', file, name='file'),
    path('resources/<uuid:pk>/', resource, name='resource'),

    re_path(r'^datacite/(?P<identifier>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).xml', datacite_resource_xml, name='datacite_resource_xml'),
    re_path(r'^datacite/(?P<identifier>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).json', datacite_resource_json, name='datacite_resource_json'),
    re_path(r'^datacite/(?P<identifier>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+)', datacite_resource, name='datacite_resource'),

    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).bib', resource_bibtex, name='resource_bibtex'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).xml', resource_xml, name='resource_xml'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).json', resource_json, name='resource_json'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+)', resource, name='resource'),

    path('attributes/', attributes, name='attributes'),

    path('search/', search, name='search'),
    path('search/<path:path>/', search, name='search'),

    path('download/', download, name='download'),
    path('download/<str:job_id>/', download, name='download'),

    path('caveats/', caveats, name='caveats'),
    path('caveats/<int:pk>/', caveat, name='caveat'),
    path('caveats/<int:pk>/subscribe/', caveat_subscribe, name='caveat_subscribe'),
    path('caveats/<int:pk>/unsubscribe/', caveat_unsubscribe, name='caveat_unsubscribe'),
    path('caveats/create/', caveat_create, name='caveat_create'),
    path('caveats/comments/create/', comment_create, name='comment_create'),
    path('subscriptions/', subscriptions, name='subscriptions'),

    path('indicators/', indicators, name='indicators'),
    path('indicators/<int:pk>/', indicator, name='indicator'),

    path('', TemplateView.as_view(template_name='core/home.html'), name='home'),
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
    ] + urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
