from django.shortcuts import render


def wizard(request):
    return render(request, 'wizard/wizard.html')
