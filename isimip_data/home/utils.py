from django.urls import reverse

from isimip_data.metadata.models import Dataset


def get_home_links(product, category_sector_publication):
    queryset = Dataset.objects.using('metadata')

    if product == 'InputData':
        queryset = queryset.filter(specifiers__category=category_sector_publication)
    elif product == 'OutputData':
        queryset = queryset.filter(specifiers__sector=category_sector_publication)
    elif product == 'DerivedOutputData':
        queryset = queryset.filter(specifiers__publication=category_sector_publication)
    else:
        queryset = queryset.none()

    queryset = queryset.order_by('specifiers__simulation_round').distinct() \
                       .values_list('specifiers__simulation_round', flat=True)
    return [
        (
            simulation_round,
            reverse('search', args=[
                f'tree/{simulation_round}%2F{product}%2F{category_sector_publication}'
            ])
        )
        for simulation_round in queryset
    ]
