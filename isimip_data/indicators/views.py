from django.shortcuts import get_object_or_404, render

from .models import Indicator


def indicators(request):
    indicators = Indicator.objects.all()

    return render(request, 'indicators/indicators.html', {
        'indicators': indicators
    })


def indicator(request, pk):
    queryset = Indicator.objects.prefetch_related('values')

    return render(request, 'indicators/indicator.html', {
        'indicator': get_object_or_404(queryset, id=pk)
    })
