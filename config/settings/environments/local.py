DEBUG = False

SECRET_KEY = 'this is not a very secret key'

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'isimip-data'
    }
}

DEBUG_TOOLBAR = True
if DEBUG_TOOLBAR:
    INSTALLED_APPS.append('debug_toolbar')
    MIDDLEWARE.append('debug_toolbar.middleware.DebugToolbarMiddleware')
    INTERNAL_IPS = ['127.0.0.1']

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'handlers': {
        'rich': {
            'level': 'DEBUG',
            'class': 'rich.logging.RichHandler'
        }
    },
    'loggers': {
        'django': {
            'handlers': ['rich'],
            'level': 'INFO'
        },
        'django.db.backends': {
            'handlers': ['rich'],
            'level': 'DEBUG',
        },
        'isimip_data': {
            'handlers': ['rich'],
            'level': 'DEBUG'
        }
    }
}
