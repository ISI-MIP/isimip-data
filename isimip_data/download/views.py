from django.shortcuts import render


def download(request, path=None):
    return render(request, 'download/download.html')
