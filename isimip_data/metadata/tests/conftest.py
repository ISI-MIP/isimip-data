import pytest

from isimip_data.metadata.models import Dataset, File, Attribute


@pytest.fixture
def datasets(db):
    return Dataset.objects.using('metadata').all()


@pytest.fixture
def files(db):
    return File.objects.using('metadata').all()


@pytest.fixture
def attributes(db):
    return Attribute.objects.using('metadata').all()
