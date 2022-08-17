from django.db.models import Q
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe

from isimip_data.metadata.models import Dataset, Resource


def query_datasets(specifiers_dict, version_after, version_before, include=None, exclude=None):
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

        if include:
            q = Q()
            for include_path in include.strip().splitlines():
                q |= Q(path__startswith=include_path)
            queryset = queryset.filter(q)

        if exclude:
            q = Q()
            for exclude_path in exclude.strip().splitlines():
                q |= Q(path__startswith=exclude_path)
            queryset = queryset.exclude(q)

        # return datasets as list
        return list(queryset.values_list('id', flat=True))
    else:
        return []


def query_resources(datasets):
    queryset = Resource.objects.using('metadata').filter(datasets__in=datasets)
    return list(queryset.values_list('id', flat=True))


def format_affected_datasets(datasets):
    datasets = Dataset.objects.using('metadata').filter(target=None, id__in=datasets)
    return format_html_join(
        mark_safe('<br>'),
        '{}#{}',
        ((dataset.path, dataset.version) for dataset in datasets)
    )


def format_affected_resources(resources):
    resources = Resource.objects.using('metadata').filter(id__in=resources)
    return format_html_join(
        mark_safe('<br>'),
        '{}',
        ((resource.doi, ) for resource in resources)
    )
