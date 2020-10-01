import os

import dj_database_url

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = (os.getenv('DEBUG', 'False').upper() == 'TRUE')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost 127.0.0.1 ::1').split()

INTERNAL_IPS = ['127.0.0.1']

INSTALLED_APPS = [
    # apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.postgres',
    'django.contrib.staticfiles',
    # isimip_data apps
    'isimip_data.core',
    'isimip_data.download',
    'isimip_data.metadata',
    'isimip_data.search',
    'isimip_data.wizard',
    # 3rd party apps
    'rest_framework',
    'rest_framework.authtoken',
    'django_filters',
    'adminsortable2',
]

if DEBUG:
    INSTALLED_APPS += [
        'django_extensions',
        'debug_toolbar',
    ]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
]

if DEBUG:
    MIDDLEWARE = [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ] + MIDDLEWARE

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django_settings_export.settings_export',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': dj_database_url.parse(os.getenv('DATABASE')),
    'metadata': dj_database_url.parse(os.getenv('DATABASE_METADATA'))
}

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Berlin'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root/')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static/')
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_root/')

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

LOGIN_URL = '/admin/'

if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    EMAIL_FROM = 'info@example.com'

else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    EMAIL_FROM = 'info@example.com'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}

SETTINGS_EXPORT = [
    'LABEL',
    'NAVIGATION',
    'FILES_BASE_URL'
]

if DEBUG:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'isimip-data',
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": "redis://127.0.0.1:6379/1",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            }
        }
    }


SEARCH_SIMILARITY = 0.2
SEARCH_SIMILARITY_LIMIT = 3

METADATA_PAGE_SIZE = 12

LABEL = os.getenv('LABEL')

NAVIGATION = [
    {
        'title': 'About the project',
        'href': 'https://www.isimip.org'
    },
    {
        'title': 'Documentation',
        'href': 'https://www.isimip.org/outputdata/isimip-data-on-the-esgf-server/'
    },
    {
        'title': 'Terms of Use',
        'href': 'https://www.isimip.org/gettingstarted/terms-of-use/#general-terms-of-use-for-all-isimip-data-on-the-esg-server'
    }
]

FILES_BASE_URL = os.getenv('FILES_BASE_URL')
FILES_API_URL = os.getenv('FILES_API_URL')

PROTOCOL_LOCATIONS = os.getenv('PROTOCOL_LOCATIONS', '').split()

RIGHTS = {
    'CC0': {
        'rights': 'CC0 1.0 Universal Public Domain Dedication',
        'rightsURI': 'https://creativecommons.org/publicdomain/zero/1.0/deed.en',
        'short': 'CC0 1.0',
        'image': 'images/cc/cc0.png',
    },
    'CC-BY': {
        'rights': 'Attribution 4.0 International',
        'rightsURI': 'https://creativecommons.org/licenses/by/4.0/',
        'short': 'CC BY 4.0',
        'image': 'images/cc/by.png',
    },
    'CC-BY-SA': {
        'rights': 'Attribution-ShareAlike 4.0 International',
        'rightsURI': 'https://creativecommons.org/licenses/by-sa/4.0/',
        'short': 'CC BY-SA 4.0',
        'image': 'images/cc/by_sa.png',
    },
    'CC-BY-NC': {
        'rights': 'Attribution-NonCommercial 4.0 International',
        'rightsURI': 'https://creativecommons.org/licenses/by-nc/4.0/',
        'short': 'CC BY-NC 4.0',
        'image': 'images/cc/by_nc.png',
    }
}

MODEL_RIGHTS = [
    ('ISIMIP2a/OutputData', 'CC-BY'),
    ('ISIMIP2b/OutputData/water_global/MPI-HM', 'CC-BY-SA'),
    ('ISIMIP2b/OutputData/water_global/WaterGAP2', 'CC-BY-NC'),
    ('ISIMIP2b/SecondaryOutputData/water_global/WaterGAP2', 'CC-BY-NC'),
    ('ISIMIP2a/OutputData', 'CC-BY'),
    ('ISIMIP3a', 'CC0'),
    ('ISIMIP3b', 'CC0'),
]

LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_DIR = os.getenv('LOG_DIR')
if LOG_DIR:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'filters': {
            'require_debug_false': {
                '()': 'django.utils.log.RequireDebugFalse'
            },
            'require_debug_true': {
                '()': 'django.utils.log.RequireDebugTrue'
            }
        },
        'formatters': {
            'default': {
                'format': '[%(asctime)s] %(levelname)s: %(message)s'
            },
            'name': {
                'format': '[%(asctime)s] %(levelname)s %(name)s: %(message)s'
            },
            'console': {
                'format': '[%(asctime)s] %(message)s'
            }
        },
        'handlers': {
            'mail_admins': {
                'level': 'ERROR',
                'filters': ['require_debug_false'],
                'class': 'django.utils.log.AdminEmailHandler'
            },
            'error_log': {
                'level': 'ERROR',
                'class': 'logging.FileHandler',
                'filename': os.path.join(LOG_DIR, 'error.log'),
                'formatter': 'default'
            },
            'isimip_data_log': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'filename': os.path.join(LOG_DIR, 'isimip_data.log'),
                'formatter': 'name'
            },
            'console': {
                'level': 'INFO',
                'filters': ['require_debug_true'],
                'class': 'logging.StreamHandler',
                'formatter': 'console'
            }
        },
        'loggers': {
            'django': {
                'handlers': ['console'],
                'level': LOG_LEVEL,
            },
            'django.request': {
                'handlers': ['mail_admins', 'error_log'],
                'level': 'ERROR',
                'propagate': True
            },
            'isimip_data': {
                'handlers': ['isimip_data_log'],
                'level': LOG_LEVEL,
                'propagate': False
            }
        }
    }
