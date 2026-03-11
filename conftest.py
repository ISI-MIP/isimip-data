from pathlib import Path

import pytest

from django.conf import settings
from django.core.management import call_command


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    from django.db import connections
    from django.test import TestCase

    connections['metadata'].settings_dict['NAME'] = \
        settings.DATABASES['metadata']['TEST']['NAME']

    TestCase.databases = ('default', 'metadata')

    with django_db_blocker.unblock():
        call_command('loaddata', *[
            str(f) for fixture_dir in settings.FIXTURE_DIRS
            for f in Path(fixture_dir).iterdir()
        ])
