from django.shortcuts import render


def bad_request(request, exception):
    return render(request, 'core/400.html', status=400)


def forbidden(request, exception):
    return render(request, 'core/403.html', status=403)


def not_found(request, exception):
    return render(request, 'core/404.html', status=404)


def internal_server_error(request):
    return render(request, 'core/500.html', status=500)
