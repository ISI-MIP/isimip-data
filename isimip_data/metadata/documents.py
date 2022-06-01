from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from .models import Dataset


@registry.register_document
class DatasetDocument(Document):
    class Index:
        name = 'datasets'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Dataset

        fields = [
            'path'
        ]

    def get_queryset(self):
        return Dataset.objects.using('metadata').all()
