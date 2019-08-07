from django.contrib import admin
from django.urls import path

from isimip_data.metadata.views import dataset, file
from isimip_data.search.views import search


urlpatterns = [
    path('admin/', admin.site.urls),

    path('datasets/<dataset_name>/', dataset, name='dataset'),
    path('files/<file_name>/', file, name='file'),

    path('', search, name='search'),
]
