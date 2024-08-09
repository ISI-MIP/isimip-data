from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import Q
from django.shortcuts import render

from isimip_data.metadata.models import Resource, Tree


def home(request):
    tree = Tree.objects.using('metadata').first()

    # get all tree_path for DerivedOutputData and construct a Q object for all resources for DerivedOutputData
    q = Q()
    for simulation_round in tree.tree_dict.keys():
        q |= Q(paths_agg__icontains=f'{simulation_round}/DerivedOutputData/')

    resources = Resource.objects.using('metadata').annotate(paths_agg=ArrayAgg('paths')).filter(q)

    return render(request, 'home/home.html', {
        'tree': tree,
        'resources': resources
    })
