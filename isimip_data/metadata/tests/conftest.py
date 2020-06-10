import pytest
from isimip_data.metadata.models import Attribute, Dataset, File, Word


@pytest.fixture
def datasets(db):
    return Dataset.objects.using('metadata').all()


@pytest.fixture
def files(db):
    return File.objects.using('metadata').all()


@pytest.fixture
def words(db):
    return Word.objects.using('metadata').all()


@pytest.fixture
def attributes(db):
    return Attribute.objects.using('metadata').all()
