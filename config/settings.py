import os

from django.utils.translation import gettext_lazy as _

import dj_database_url

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = (os.getenv('DEBUG', 'False').upper() == 'TRUE')

DEBUG_TOOLBAR = os.getenv('DEBUG_TOOLBAR', 'False').upper() == 'TRUE'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost 127.0.0.1 ::1').split()

INTERNAL_IPS = ['127.0.0.1']

SITE_ID = 1

INSTALLED_APPS = [
    # apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.postgres',
    'django.contrib.sites',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    # isimip_data apps
    'isimip_data.accounts',
    'isimip_data.annotations',
    'isimip_data.caveats',
    'isimip_data.core',
    'isimip_data.download',
    'isimip_data.indicators',
    'isimip_data.metadata',
    'isimip_data.search',
    # 3rd party apps
    'rest_framework',
    'rest_framework.authtoken',
    'django_cleanup',
    'django_extensions',
    'django_filters',
    'django_datacite',
    'adminsortable2',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.orcid'
]

if DEBUG_TOOLBAR:
    INSTALLED_APPS += [
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
    'django.contrib.sites.middleware.CurrentSiteMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

if DEBUG_TOOLBAR:
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

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

LANGUAGE_CODE = 'en-us'

LANGUAGES = [
  ('en', _('English')),
]

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

FIXTURE_DIRS = (
   os.path.join(BASE_DIR, 'testing/fixtures'),
)

LOGIN_URL = '/account/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_URL = '/account/logout/'
LOGOUT_REDIRECT_URL = '/'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend'
]

ACCOUNT_USER_DISPLAY = 'isimip_data.accounts.utils.get_full_name'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_ACTIVATION_DAYS = 7
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 7
ACCOUNT_EMAIL_VERIFICATION = 'optional'
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_USERNAME_MIN_LENGTH = 4
ACCOUNT_PASSWORD_MIN_LENGTH = 4

if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    EMAIL_FROM = 'noreply@isimip.org'

else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_PORT = os.getenv('EMAIL_PORT', 25)
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
    EMAIL_USE_TLS = (os.getenv('EMAIL_USE_TLS', 'False').upper() == 'TRUE')
    EMAIL_USE_SSL = (os.getenv('EMAIL_USE_SSL', 'False').upper() == 'TRUE')
    DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@isimip.org')


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication'
    ],
    'DEFAULT_PERMISSION_CLASSES': [],
}

SETTINGS_EXPORT = [
    'LABEL',
    'ALERT',
    'NAVIGATION',
    'FILES_BASE_URL',
    'TERMS_OF_USE',
    'TERMS_OF_USE_URL',
    'LOGIN_URL',
    'LOGOUT_URL',
    'DOI_PREFIX',
    'HOME',
    'METADATA_RESOURCE_MAX_DATASETS'
]

if os.getenv('CACHE') == 'dummy':
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
    }
elif os.getenv('CACHE') == 'redis':
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": "redis://127.0.0.1:6379/1",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            }
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'isimip-data',
            'TIMEOUT': 5
        }
    }

SEARCH_SIMILARITY = 0.5
SEARCH_SIMILARITY_LIMIT = 3

METADATA_PAGE_SIZE = os.getenv('METADATA_PAGE_SIZE', 10)
METADATA_MAX_PAGE_SIZE = os.getenv('METADATA_MAX_PAGE_SIZE', 1000)
METADATA_RESOURCE_MAX_DATASETS = os.getenv('METADATA_RESOURCE_MAX_DATASETS', 100)

LABEL = os.getenv('LABEL')
ALERT = os.getenv('ALERT')

TERMS_OF_USE = 'When using ISIMIP data for your research, please appropriately credit the data providers, e.g. either by citing the DOI for the dataset, or by appropriate acknowledgment. We strongly encourage to offer co-authorship to at least a representative of the data providers.'

TERMS_OF_USE_URL = 'https://www.isimip.org/gettingstarted/terms-of-use/#general-terms-of-use-for-all-isimip-data-on-the-esg-server'

NAVIGATION = [
    {
        'title': 'Documentation',
        'href': 'https://www.isimip.org/outputdata/isimip-repository/'
    },
    {
        'title': 'Terms of Use',
        'href': TERMS_OF_USE_URL
    }
]

HOME = {
    'climate': ['ISIMIP2a', 'ISIMIP2b', 'ISIMIP3a', 'ISIMIP3b'],
    'socioeconomic': ['ISIMIP2a', 'ISIMIP2b', 'ISIMIP3a', 'ISIMIP3b'],
    'geo_conditions': ['ISIMIP2a', 'ISIMIP2b', 'ISIMIP3a', 'ISIMIP3b'],
    'agriculture': ['ISIMIP2a', 'ISIMIP2b'],
    'biodiversity': ['ISIMIP2a', 'ISIMIP2b'],
    'biomes': ['ISIMIP2a', 'ISIMIP2b'],
    'lakes_global': ['ISIMIP2a', 'ISIMIP2b'],
    'lakes_local': ['ISIMIP2a', 'ISIMIP2b'],
    'marine-fishery_global': ['ISIMIP3b'],
    'marine-fishery_regional': ['ISIMIP3b'],
    'permafrost': ['ISIMIP2a', 'ISIMIP2b'],
    'water_global': ['ISIMIP2a', 'ISIMIP2b'],
    'water_regional': ['ISIMIP2a', 'ISIMIP2b']
}

FILES_BASE_URL = os.getenv('FILES_BASE_URL')
FILES_API_URL = os.getenv('FILES_API_URL')

CAVEATS_REPLY_TO = (
    'ISIMIP data <isimip-data@isimip.org>',
)
CAVEATS_DEFAULT_RECIPIENTS = (
    'isimip-data_updates@listserv.dfn.de',
)

PROXY = os.getenv('PROXY', '').split()
PROXY_FILES_BASE_URL = os.getenv('PROXY_FILES_BASE_URL')
PROXY_FILES_API_URL = os.getenv('PROXY_FILES_API_URL')

PROTOCOL_LOCATIONS = os.getenv('PROTOCOL_LOCATIONS', '').split()

DOWNLOAD = {
    'cutout': {
        'help': 'You can cutout a specific bounding box given by its south, north, west, and east border. This is done on the server using the <code>ncks</code> command which is part of the <a href="http://nco.sourceforge.net" target="_blank">NCO toolkit</a>.'
    },
    'cutout_bbox': {
        'label': 'Cut out bounding box',
        'help': 'The files are cut out using the bounding box given by you (e.g. -23.43651, 23.43651, -180, 180) and the command: <code>ncks -O -h -d lat,SOUTH,NORTH -d lon,WEST,EAST IFILE OFILE</code>.',
        'resolutions': ['30arcsec', '90arcsec', '360arcsec', '1800arcsec', 'halfdeg', 'onedeg', 'twodeg']
    },
    'mask': {
        'help': 'You can also mask all data outside of a certain country, bounding box, or by applying a land-sea-mask. The compression of the NetCDF file will then reduce the file size considerably. The resulting file will still have the same dimensions and metadata as the original. The extraction is done on the server using the <a href="https://code.mpimet.mpg.de/projects/cdo/" target="_blank">CDO toolkit</a>.'
    },
    'mask_country': {
        'label': 'Mask by country',
        'help': 'The files are masked using the countrymask of the ISIPEDIA project (<a href="https://github.com/ISI-MIP/isipedia-countries/blob/master/countrymasks.nc" target="_blank">available on GitHub</a>) and the command: <code>cdo -f nc4c -z zip_5 -ifthen IFILE -selname,m_COUNTRY COUNTRYMASK OFILE</code>.',
        'resolutions': ['halfdeg']
    },
    'mask_bbox': {
        'label': 'Mask by bounding box',
        'help': 'The files are masked using the bounding box given by you (e.g. -23.43651, 23.43651, -180, 180) and the command:  <code>cdo -f nc4c -z zip_5 -masklonlatbox,WEST,EAST,SOUTH,NORTH IFILE OFILE</code>.',
        'resolutions': ['halfdeg', 'onedeg', 'twodeg']
    },
    'mask_landonly': {
        'label': 'Mask only land data',
        'help': 'The files are masked using the ISIMIP3 landseamask without Antarctica (<a href="https://doi.org/10.48364/ISIMIP.822294" target="_blank">https://data.isimip.org/10.48364/ISIMIP.822294</a>) and the command: <code>cdo -f nc4c -z zip_5 -ifthen IFILE -selname,mask LANDSEAMASK OFILE</code>.',
        'resolutions': ['halfdeg']
    },
    'select': {
        'help': 'If you are interested in a time series for a certain region, you can extract the data for one point, for a country, or for a bounding box. The values are averaged over the selected area and CSV files containing dates and values is returned. The extraction is done on the server using the <a href="https://code.mpimet.mpg.de/projects/cdo/" target="_blank">CDO toolkit</a>.'
    },
    'select_country': {
        'label': 'Select by country',
        'help': 'The time series is extracted using the countrymask of the ISIPEDIA project (<a href="https://github.com/ISI-MIP/isipedia-countries/blob/master/countrymasks.nc" target="_blank">available on GitHub</a>) and the command: <code>cdo -s outputtab,date,value,nohead -fldmean -ifthen IFILE -selname,m_COUNTRY COUNTRYMASK</code>.',
        'resolutions': ['halfdeg']
    },
    'select_bbox': {
        'label': 'Select by bounding box',
        'help': 'The time series is extracted using the bounding box given by you (e.g. -23.43651, 23.43651, -180, 180) and the command: <code>cdo -s outputtab,date,value,nohead -fldmean -sellonlatbox,WEST,EAST,SOUTH,NORTH IFILE</code>.',
        'resolutions': ['halfdeg', 'onedeg', 'twodeg']
    },
    'select_point': {
        'label': 'Select by point',
        'help': 'The time series is extracted by calculating the grid index for the point given by you (e.g. 52.39, 13.06) and the command: <code>cdo -s outputtab,date,value,nohead -selindexbox,IX,IX,IY,IY IFILE</code>.',
        'resolutions': ['halfdeg', 'onedeg', 'twodeg']
    }
}

DOI_PREFIX = '10.48364'

DATACITE_INCLUDE_CITATION = True
DATACITE_DEFAULT_PUBLISHER = 'ISIMIP Repository'

LOG_LEVEL = os.getenv('LOG_LEVEL', 'WARNING')
LOG_DIR = os.getenv('LOG_DIR')
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
        'django_log': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(LOG_DIR, 'django.log'),
            'formatter': 'default'
        },
        'isimip_data_log': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(LOG_DIR, 'isimip_data.log'),
            'formatter': 'name'
        },
        'django_datacite_log': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(LOG_DIR, 'django_datacite.log'),
            'formatter': 'name'
        },
        'general_log': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(LOG_DIR, 'general.log'),
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
            'handlers': ['console', 'django_log'],
            'level': LOG_LEVEL,
            'propagate': False
        },
        'django.request': {
            'handlers': ['mail_admins', 'error_log'],
            'level': 'ERROR',
            'propagate': True
        },
        'isimip_data': {
            'handlers': ['console', 'isimip_data_log'],
            'level': LOG_LEVEL,
            'propagate': False
        },
        'django_datacite': {
            'handlers': ['console', 'django_datacite_log'],
            'level': LOG_LEVEL,
            'propagate': False
        },
        '': {
            'handlers': ['console', 'general_log'],
            'level': LOG_LEVEL,
        }
    }
}
