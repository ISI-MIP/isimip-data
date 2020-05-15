from django.shortcuts import render


def search(request, path=None):
    return render(request, 'search/search.html')
