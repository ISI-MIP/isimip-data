import pytest
from django.core.management import call_command
from isimip_data.search.models import Facet


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command('loaddata', 'testing/fixtures/search.json')


@pytest.fixture
def facets(db):
    return Facet.objects.all()
