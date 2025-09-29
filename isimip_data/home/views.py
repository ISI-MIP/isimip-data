from django.template.response import TemplateResponse

from isimip_data.metadata.models import Resource, Tree


def home(request):
    tree = Tree.objects.using('metadata').first()
    resources = {
        'derived_input_data': Resource.objects.using('metadata').filter_by_tree(tree, product='DerivedInputData'),
        'derived_output_data': Resource.objects.using('metadata').filter_by_tree(tree, product='DerivedOutputData')
    }

    return TemplateResponse(request, 'home/home.html', {
        'tree': tree,
        'resources': resources
    })
