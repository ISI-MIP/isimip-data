from pathlib import Path

from django.utils.translation import gettext_lazy as _

BASE_DIR = Path(__file__).parent.parent.parent

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
    'isimip_data.annotations',
    'isimip_data.caveats',
    'isimip_data.core',
    'isimip_data.download',
    'isimip_data.home',
    'isimip_data.metadata',
    'isimip_data.search',
    # 3rd party apps
    'rest_framework',
    'rest_framework.authtoken',
    'django_cleanup',
    'django_extensions',
    'django_filters',
    'adminsortable2'
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
    'isimip_data.metadata.middleware.MetadataCacheMiddleware'
]

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
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'isimip_data'
    },
    'metadata': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'isimip_metadata'
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

LANGUAGE_CODE = 'en-us'

LANGUAGES = [
  ('en', _('English')),
]

TIME_ZONE = 'Europe/Berlin'

USE_I18N = True

USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static_root/'
STATICFILES_DIRS = [
    BASE_DIR / 'static/'
]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media_root/'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

FIXTURE_DIRS = (
   BASE_DIR / 'testing' / 'fixtures',
)

LOGIN_URL = '/account/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_URL = '/account/logout/'
LOGOUT_REDIRECT_URL = '/'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_FROM = 'noreply@isimip.org'

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
    'CACHE_MIDDLEWARE_SECONDS',
    'CAVEATS_MAX_DATASETS',
    'CAVEATS_LIST_SUBSCRIBE_URL',
    'CAVEATS_LIST_ARCHIVE_URL',
    'METADATA_RESOURCE_MAX_DATASETS',
]

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

CACHE_MIDDLEWARE_SECONDS = 60 * 60 * 24 * 7  # one week
CACHE_MIDDLEWARE_KEY_PREFIX = 'metadata'

DEBUG_TOOLBAR = False

LOG_LEVEL = False
LOG_PATH = False

SEARCH_SIMILARITY = 0.2
SEARCH_SIMILARITY_LIMIT = 3

METADATA_PAGE_SIZE = 10
METADATA_MAX_PAGE_SIZE = 1000
METADATA_RESOURCE_MAX_DATASETS = 100
METADATA_GLOSSARY_KEYS = ['title', 'description', 'warning', 'long_name', 'units', 'urls']
METADATA_MAX_COUNT = 1000
METADATA_MAX_SUGGESTIONS = 10

LABEL = None
ALERT = None

TERMS_OF_USE = 'When using ISIMIP data for your research, please appropriately credit ' \
               'the data providers, e.g. either by citing the DOI for the dataset, or ' \
               'by appropriate acknowledgment. We strongly encourage to offer co-authorship ' \
               'to at least a representative of the data providers.'

TERMS_OF_USE_URL = 'https://www.isimip.org/gettingstarted/terms-of-use/' \
                   '#general-terms-of-use-for-all-isimip-data-on-the-esg-server'

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

FILES_BASE_URL = 'https://files.isimip.org'
FILES_API_URL = 'https://files.isimip.org/api/v2'

CAVEATS_REPLY_TO = (
    'ISIMIP data <isimip-data@isimip.org>',
)
CAVEATS_DEFAULT_RECIPIENTS = (
    'isimip-data-issues-notes@listserv.dfn.de',
)

CAVEATS_LIST_SUBSCRIBE_URL = 'https://www.listserv.dfn.de/sympa/subscribe/isimip-data-issues-notes'
CAVEATS_LIST_ARCHIVE_URL = 'https://www.listserv.dfn.de/sympa/arc/isimip-data-issues-notes'

CAVEATS_MAX_DATASETS = 100

PROXY = None
PROXY_FILES_BASE_URL = None
PROXY_FILES_API_URL = None

PROTOCOL_LOCATIONS = [
    'https://protocol.isimip.org',
    'https://protocol2.isimip.org'
]

DOWNLOAD_OPERATIONS_HELP = '''
Please select one of the operations using the button below. You can select multiple operations which are
applied subsequently. If you are interested in a time series of a variable, please select the corresponding operation
for corresponding area or point and then check the boxes for averaging and creating a CSV.
'''

DOWNLOAD_OPERATIONS = [
    {
        'operation': 'select_bbox',
        'title': 'Select rectangular box',
        'label': '**Select a rectangular box** using `cdo`.',
        'template': 'download/operations/select_bbox.html',
        'resolutions': ['15arcmin', '30arcmin', '60arcmin', '120arcmin'],
        'initial': {
            'bbox': [-180,180,-23.43651,23.43651],
            'compute_mean': False,
            'output_csv': False
        }
    },
    {
        'operation': 'select_point',
        'title': 'Select point',
        'label': '**Select a point** using `cdo`.',
        'template': 'download/operations/select_point.html',
        'resolutions': ['15arcmin', '30arcmin', '60arcmin', '120arcmin'],
        'initial': {
            'point': [13.064332, 52.38051],
            'output_csv': False,
            'is_last': True
        },
    },
    {
        'operation': 'mask_bbox',
        'title': 'Mask by bounding box',
        'label': '**Mask a rectangular box** using `cdo`,'
                 ' keeping the grid and setting everything outside to `missing_value`.',
        'template': 'download/operations/mask_bbox.html',
        'resolutions': ['15arcmin', '30arcmin', '60arcmin', '120arcmin'],
        'initial': {
            'bbox': [-180,180,-23.43651,23.43651],
            'compute_mean': False,
            'output_csv': False
        }
    },
    {
        'operation': 'mask_country',
        'title': 'Mask by country',
        'label': '**Mask a country** using `cdo` and the ISIMIP countrymask,'
                 ' keeping the grid and setting everything outside to `missing_value`.',
        'template': 'download/operations/mask_country.html',
        'resolutions': ['30arcmin'],
        'initial': {
            'country': 'aus',
            'compute_mean': False,
            'output_csv': False
        }
    },
    {
        'operation': 'mask_landonly',
        'title': 'Mask only land data',
        'label': '**Mask only the land data** using `cdo` and the ISIMIP landseamask,'
                 ' keeping the grid and setting everything outside to `missing_value`.',
        'template': 'download/operations/mask_landonly.html',
        'resolutions': ['30arcmin']
    },
    {
        'operation': 'mask_mask',
        'title': 'Mask using a NetCDF custom mask',
        'label': '**Mask using a custom NetCDF mask** using `cdo`,'
                 ' keeping the grid and setting everything outside to `missing_value`.',
        'template': 'download/operations/mask_mask.html',
        'accept': {
            'application/x-hdf': ['.nc', '.nc4']
        },
        'resolutions': ['30arcsec', '90arcsec', '300arcsec', '1800arcsec',
                        '15arcmin', '30arcmin', '60arcmin', '120arcmin'],
        'initial': {
            'mask': None,
            'var': ''
        }
    },
    {
        'operation': 'mask_shape',
        'title': 'Mask using a custom Shapefile or GeoJSON',
        'label': '**Mask using a custom Shapefile or GeoJSON** using `cdo`,'
                 ' keeping the grid and setting everything outside to `missing_value`.',
        'template': 'download/operations/mask_shape.html',
        'accept': {
            'application/json': ['.json', '.geojson'],
            'application/zip': ['.zip']
        },
        'resolutions': ['30arcsec', '90arcsec', '300arcsec', '1800arcsec',
                        '15arcmin', '30arcmin', '60arcmin', '120arcmin'],
        'initial': {
            'shape': None,
            'layer': 0
        }
    },
    {
        'operation': 'cutout_bbox',
        'title': 'Cut out bounding box',
        'label': '**Cut out a rectangular box** using `ncks` (prefered for high-resolution datasets).',
        'template': 'download/operations/cutout_bbox.html',
        'resolutions': ['30arcsec', '90arcsec', '300arcsec', '1800arcsec',
                        '15arcmin', '30arcmin', '60arcmin', '120arcmin'],
        'initial': {
            'bbox': [-180,180,-23.43651,23.43651],
            'compute_mean': False,
            'output_csv': False
        }
    },
    {
        'operation': 'cutout_point',
        'title': 'Cut out point',
        'label': '**Cut out a point** using `ncks` (prefered for high-resolution datasets).',
        'template': 'download/operations/cutout_point.html',
        'resolutions': ['30arcsec', '90arcsec', '300arcsec', '1800arcsec',
                        '15arcmin', '30arcmin', '60arcmin', '120arcmin'],
        'initial': {
            'point': [13.064332, 52.38051],
            'output_csv': False,
            'is_last': True
        },
    }
]

DOWNLOAD_ERRORS = {
    'bbox': ['Please enter a valid bounding box.'],
    'point': ['Please enter a valid point.'],
    'country': ['Please select a country.'],
    'mask': ['Please select a valid NetCDF file.'],
    'shape': ['Please select a valid Shapefile or GeoJSON file.'],
    'var': ['Please enter a valid name for a variable.'],
    'layer': ['Please enter a layer.']
}

RESTRICTED_MESSAGES = {}
RESTRICTED_DEFAULT_MESSAGE = 'Please contact <a href="mailto:info@isimip.org">info@isimip.org</a>' \
                             ' if you need access to the dataset.'
