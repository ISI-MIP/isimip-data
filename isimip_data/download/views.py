from django.shortcuts import render


def download(request):
    return render(request, 'download/download.html')
