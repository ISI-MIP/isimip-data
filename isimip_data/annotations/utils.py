from django.db.models import Q
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe

from isimip_data.metadata.models import Dataset


def query_datasets(specifiers_dict, version_after, version_before):
    if specifiers_dict:
        queryset = Dataset.objects.using('metadata')
        for identifier, specifiers in specifiers_dict.items():
            q = Q()
            for specifier in specifiers:
                q |= Q(specifiers__contains={identifier: specifier})
            queryset = queryset.filter(q)

        if version_after:
            queryset = queryset.filter(version__gte=version_after)

        if version_before:
            queryset = queryset.filter(version__lte=version_before)

        # return datasets as list
        return list(queryset.values_list('id', flat=True))
    else:
        return []


def format_affected_datasets(datasets):
    datasets = Dataset.objects.using('metadata').filter(id__in=datasets)
    return format_html_join(
        mark_safe('<br>'),
        '{}#{}',
        ((dataset.name, dataset.version) for dataset in datasets)
    )
