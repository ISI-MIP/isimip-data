import pytest
from django.core.management import call_command
from isimip_data.wizard.models import Layer


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command('loaddata', 'testing/fixtures/wizard.json')


@pytest.fixture
def layers(db):
    return Layer.objects.all()
