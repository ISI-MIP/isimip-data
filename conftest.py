import os

import pytest

from django.conf import settings
from django.contrib.admin.utils import flatten
from django.core.management import call_command


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    from django.test import TestCase
    TestCase.multi_db = True
    TestCase.databases = ('default', 'metadata')

    with django_db_blocker.unblock():
        fixtures = flatten([os.listdir(fixture_dir) for fixture_dir in settings.FIXTURE_DIRS])
        call_command('loaddata', *fixtures)
