from django.contrib import admin
from django.views.generic.base import TemplateView
from django.urls import path


urlpatterns = [
    path('', TemplateView.as_view(template_name='core/home.html'), name='home'),
    path('admin/', admin.site.urls),
]
