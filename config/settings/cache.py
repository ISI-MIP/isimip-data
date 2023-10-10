if CACHE == 'locmem':
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': CACHE_LOCATION
        }
    }
elif CACHE == 'redis':
    CACHES = {
        "default": {
            "BACKEND": 'django_redis.cache.RedisCache',
            "LOCATION": f'redis://127.0.0.1:6379/{CACHE_DB}',
            "OPTIONS": {
                "CLIENT_CLASS": 'django_redis.client.DefaultClient',
            }
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
    }
