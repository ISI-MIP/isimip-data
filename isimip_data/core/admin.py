from django.contrib.admin import AdminSite as DjangoAdminSite
from django.contrib.admin.apps import AdminConfig as DjangoAdminConfig


class AdminConfig(DjangoAdminConfig):
    default_site = 'isimip_data.core.admin.AdminSite'


class AdminSite(DjangoAdminSite):
    site_header = 'ISIMIP Repository administration'
