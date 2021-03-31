from django.contrib.admin import AdminSite as DjangoAdminSite


class AdminSite(DjangoAdminSite):
    site_header = 'Monty Python administration'


admin_site = AdminSite()
