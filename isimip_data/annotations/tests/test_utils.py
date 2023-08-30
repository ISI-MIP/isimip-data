import re

from isimip_data.annotations.utils import format_affected_datasets, query_datasets
from isimip_data.metadata.models import Dataset


def test_query_datasets(db):
    datasets = query_datasets({'model': ['model2']}, None, None)
    assert len(datasets) == 2


def test_query_datasets_empty(db):
    datasets = query_datasets({}, None, None)
    assert len(datasets) == 0


def test_query_datasets_after(db):
    datasets = query_datasets({'model': ['model2']}, '20200101', None)
    assert len(datasets) == 2


def test_query_datasets_before(db):
    datasets = query_datasets({'model': ['model2']}, None, '20200101')
    assert len(datasets) == 0


def test_format_affected_datasets(db):
    affected_datasets = format_affected_datasets(
        Dataset.objects.using('metadata').filter(specifiers__contains={'model': 'model'})
    )
    assert len(re.findall(r'<br>', affected_datasets)) == 1
