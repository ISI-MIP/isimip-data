from django.shortcuts import render

from isimip_data.metadata.models import Tree


def home(request):
    return render(request, 'home/home.html', {
        'tree': Tree.objects.using('metadata').first()
    })
