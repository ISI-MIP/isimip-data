from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic.base import TemplateView
from rest_framework import routers

from isimip_data.accounts.views import (profile_delete, profile_delete_success,
                                        profile_update)
from isimip_data.caveats.views import (caveat, caveat_create, caveat_subscribe,
                                       caveat_unsubscribe, caveats,
                                       comment_create, subscriptions)
from isimip_data.core.viewsets import SettingsViewSet
from isimip_data.download.views import download
from isimip_data.download.viewsets import CountryViewSet
from isimip_data.metadata.views import (attributes, dataset, file, metadata,
                                        resource, resource_bibtex,
                                        resource_datacite_json,
                                        resource_datacite_xml, resources)
from isimip_data.metadata.viewsets import (DatasetViewSet, FileViewSet,
                                           GlossaryViewSet, ResourceViewSet,
                                           TreeViewSet)
from isimip_data.search.views import search
from isimip_data.search.viewsets import FacetViewSet
# from isimip_data.wizard.views import wizard
from isimip_data.wizard.viewsets import LayerViewSet

router = routers.DefaultRouter()
router.register(r'datasets', DatasetViewSet, basename='dataset')
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'glossary', GlossaryViewSet, basename='glossary')
router.register(r'tree', TreeViewSet, basename='tree')
router.register(r'files', FileViewSet, basename='file')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'facets', FacetViewSet, basename='facet')
router.register(r'layers', LayerViewSet, basename='layer')
router.register(r'settings', SettingsViewSet, basename='setting')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),

    path('account/profile/', profile_update, name='profile_update'),
    path('account/profile/delete/', profile_delete, name='profile_delete'),
    path('account/profile/delete/success/', profile_delete_success, name='profile_delete_success'),
    path('account/', include('allauth.urls')),

    path('metadata/', metadata, name='metadata'),

    path('datasets/<uuid:pk>/', dataset, name='dataset'),
    path('datasets/<path:path>/', dataset, name='dataset'),

    path('files/<uuid:pk>/', file, name='file'),
    path('files/<path:path>/', file, name='file'),

    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).bib', resource_bibtex, name='resource_bibtex'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).datacite.xml', resource_datacite_xml, name='resource_datacite_xml'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+).datacite.json', resource_datacite_json, name='resource_datacite_json'),
    re_path(r'^(?P<doi>\d{2}\.\d+\/[A-Za-z0-9_.\-\/]+)', resource, name='resource'),

    path('resources/', resources, name='resources'),

    path('attributes/', attributes, name='attributes'),

    path('search/', search, name='search'),
    path('search/<path:path>/', search, name='search'),

    path('download/', download, name='download'),
    path('download/<path:path>/', download, name='download'),

    path('caveats/', caveats, name='caveats'),
    path('caveats/<int:pk>/', caveat, name='caveat'),
    path('caveats/<int:pk>/subscribe/', caveat_subscribe, name='caveat_subscribe'),
    path('caveats/<int:pk>/unsubscribe/', caveat_unsubscribe, name='caveat_unsubscribe'),
    path('caveats/create/', caveat_create, name='caveat_create'),
    path('caveats/comments/', comment_create, name='comment_create'),
    path('subscriptions/', subscriptions, name='subscriptions'),

    # path('wizard/', wizard, name='wizard'),

    path('', TemplateView.as_view(template_name='core/home.html'), name='home'),
]

handler400 = 'isimip_data.core.views.bad_request'
handler403 = 'isimip_data.core.views.forbidden'
handler404 = 'isimip_data.core.views.not_found'
handler500 = 'isimip_data.core.views.internal_server_error'

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
