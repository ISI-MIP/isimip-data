from django.contrib import admin
from django.views.generic.base import TemplateView
from django.urls import path


urlpatterns = [
    path('', TemplateView.as_view(template_name='search/search.html'), name='search'),
    path('admin/', admin.site.urls),
]
