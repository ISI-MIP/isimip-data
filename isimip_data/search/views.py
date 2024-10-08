from django.shortcuts import redirect, render


def search(request, path=None):
    # redirect GET params to match react location
    if request.GET:
        url = request.path.rstrip('/')
        for key in request.GET:
            for value in request.GET.getlist(key):
                url += f'/{key}/{value}'

        return redirect(url)

    return render(request, 'search/search.html', {'title': 'Search'})
