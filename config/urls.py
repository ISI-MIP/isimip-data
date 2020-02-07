from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from isimip_data.metadata.views import dataset, file
from isimip_data.metadata.viewsets import (DatasetViewSet, FileViewSet,
                                           GlossaryViewSet)
from isimip_data.search.views import search
from isimip_data.search.viewsets import FacetViewSet
from isimip_data.wizard.views import wizard
from isimip_data.wizard.viewsets import LayerViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'datasets', DatasetViewSet, basename='dataset')
router.register(r'glossary', GlossaryViewSet, basename='glossary')
router.register(r'files', FileViewSet, basename='file')
router.register(r'facets', FacetViewSet, basename='facet')
router.register(r'layers', LayerViewSet, basename='layer')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('datasets/<uuid:dataset_id>/', dataset, name='dataset'),
    path('files/<uuid:file_id>/', file, name='file'),

    path('api/v1/', include(router.urls)),

    re_path(r'^search/', search, name='search'),
    path('', wizard, name='wizard'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
