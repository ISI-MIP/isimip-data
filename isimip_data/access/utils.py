from django.conf import settings

import jwt


def encode_token(payload):
    return jwt.encode(payload, settings.FILES_AUTH_SECRET, algorithm="HS256")


def decode_token(jwt_string):
    try:
        payload = jwt.decode(jwt_string, settings.FILES_AUTH_SECRET, algorithms=["HS256"])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "The provided token is expired."
    except jwt.InvalidTokenError:
        return None, "The provided token is invalid."


def get_access_tokens(request):
    payloads = []
    for cookie in request.COOKIES:
        if cookie.startswith('isimip_access_token'):
            token = request.COOKIES.get(cookie)
            if token:
                payload, error = decode_token(token)
                if payload:
                    payloads.append(payload)

    return payloads


def parse_cookies(request):
    payloads = []
    for cookie in request.COOKIES:
        if cookie.startswith('isimip_access_token'):
            token = request.COOKIES.get(cookie)
            if token:
                payload, error = decode_token(token)
                if payload:
                    payloads.append(payload)

    return payloads


def check_access(request, path):
    for resource in parse_cookies(request):
        for resource_path in resource.get('paths', []):
            if path.startswith(resource_path):
                return True
