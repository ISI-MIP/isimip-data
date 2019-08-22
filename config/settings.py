import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

if os.getenv('DJANGO_DEBUG'):
    DEBUG = (os.getenv('DJANGO_DEBUG').upper() == 'TRUE')
else:
    DEBUG = False

if os.getenv('DJANGO_ALLOWED_HOSTS'):
    ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', '').split()
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '::1']

INTERNAL_IPS = ['127.0.0.1']

INSTALLED_APPS = [
    # django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.postgres',
    'django.contrib.staticfiles',
    # isimip_data apps
    'isimip_data.core',
    'isimip_data.metadata',
    'isimip_data.search',
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
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv('DJANGO_DBNAME'),
        'USER': os.getenv('DJANGO_DBUSER'),
        'PASSWORD': os.getenv('DJANGO_DBPASS'),
        'HOST': os.getenv('DJANGO_DBHOST'),
        'PORT': os.getenv('DJANGO_DBPORT'),
    },
    'metadata': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv('DJANGO_METADATA_DBNAME'),
        'USER': os.getenv('DJANGO_METADATA_DBUSER'),
        'PASSWORD': os.getenv('DJANGO_METADATA_DBPASS'),
        'HOST': os.getenv('DJANGO_METADATA_DBHOST'),
        'PORT': os.getenv('DJANGO_METADATA_DBPORT'),
    }
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

SEARCH_SIMILARITY = 0.4

FILES_BASE_URL = os.getenv('DJANGO_FILES_BASE_URL')

LOGGING_DIR = os.getenv('DJANGO_LOGGING_DIR', 'log')
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
            'filename': os.path.join(LOGGING_DIR, 'error.log'),
            'formatter': 'default'
        },
        'isimip_data_log': {
            'level': 'DEBUG',
            'class':'logging.FileHandler',
            'filename': os.path.join(LOGGING_DIR, 'isimip_data.log'),
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
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        },
        'django.request': {
            'handlers': ['mail_admins', 'error_log'],
            'level': 'ERROR',
            'propagate': True
        },
        'isimip_data': {
            'handlers': ['isimip_data_log'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False
        }
    }
}
