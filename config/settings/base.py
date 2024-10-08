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
FILES_API_URL = 'https://files.isimip.org/api/v1'

CAVEATS_REPLY_TO = (
    'ISIMIP data <isimip-data@pik-potsdam.de>',
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

DOWNLOAD = {
    'cutout': {
        'help': 'You can cutout a specific bounding box given by its south, north, west,'
                ' and east border. This is done on the server using the <code>ncks</code>'
                ' command which is part of the <a href="http://nco.sourceforge.net"'
                ' target="_blank">NCO toolkit</a>.'
    },
    'cutout_bbox': {
        'label': 'Cut out bounding box',
        'help': 'The files are cut out using the bounding box given by you (e.g. -23.43651,'
                ' 23.43651, -180, 180) and the command: <code>ncks -O -h -d lat,SOUTH,NORTH'
                ' -d lon,WEST,EAST IFILE OFILE</code>.',
        'resolutions': ['30arcsec', '90arcsec', '300arcsec', '1800arcsec',
                        '15arcmin', '30arcmin', '60arcmin', '120arcmin']
    },
    'mask': {
        'help': 'You can also mask all data outside of a certain country, bounding box,'
                ' or by applying a land-sea-mask. The compression of the NetCDF file will'
                ' then reduce the file size considerably. The resulting file will still'
                ' have the same dimensions and metadata as the original. The extraction is'
                ' done on the server using the <a href="https://code.mpimet.mpg.de/projects/cdo/"'
                ' target="_blank">CDO toolkit</a>.'
    },
    'mask_country': {
        'label': 'Mask by country',
        'help': 'The files are masked using the countrymask of the ISIPEDIA project'
                ' (<a href="https://github.com/ISI-MIP/isipedia-countries/blob/master/countrymasks.nc"'
                ' target="_blank">available on GitHub</a>) and the command: <code>cdo -f nc4c -z zip_5'
                ' -ifthen IFILE -selname,m_COUNTRY COUNTRYMASK OFILE</code>.',
        'resolutions': ['30arcmin']
    },
    'mask_bbox': {
        'label': 'Mask by bounding box',
        'help': 'The files are masked using the bounding box given by you (e.g. -23.43651,'
                ' 23.43651, -180, 180) and the command:  <code>cdo -f nc4c -z zip_5'
                ' -masklonlatbox,WEST,EAST,SOUTH,NORTH IFILE OFILE</code>.',
        'resolutions': ['15arcmin', '30arcmin', '60arcmin', '120arcmin']
    },
    'mask_landonly': {
        'label': 'Mask only land data',
        'help': 'The files are masked using the ISIMIP3 landseamask without Antarctica'
                ' (<a href="https://doi.org/10.48364/ISIMIP.822294" target="_blank">'
                'https://data.isimip.org/10.48364/ISIMIP.822294</a>) and the command:'
                ' <code>cdo -f nc4c -z zip_5 -ifthen IFILE -selname,mask LANDSEAMASK OFILE</code>.',
        'resolutions': ['30arcmin']
    },
    'select': {
        'help': 'If you are interested in a time series for a certain region, you can extract'
                ' the data for one point, for a country, or for a bounding box. The values are'
                ' averaged over the selected area and CSV files containing dates and values is'
                ' returned. The extraction is done on the server using the'
                ' <a href="https://code.mpimet.mpg.de/projects/cdo/" target="_blank">CDO toolkit</a>.'
    },
    'select_country': {
        'label': 'Select by country',
        'help': 'The time series is extracted using the countrymask of the ISIPEDIA project'
                ' (<a href="https://github.com/ISI-MIP/isipedia-countries/blob/master/countrymasks.nc"'
                ' target="_blank">available on GitHub</a>) and the command: <code>cdo -s outputtab,date,value,nohead'
                ' -fldmean -ifthen IFILE -selname,m_COUNTRY COUNTRYMASK</code>.',
        'resolutions': ['30arcmin']
    },
    'select_bbox': {
        'label': 'Select by bounding box',
        'help': 'The time series is extracted using the bounding box given by you (e.g. -23.43651,'
                ' 23.43651, -180, 180) and the command: <code>cdo -s outputtab,date,value,nohead'
                ' -fldmean -sellonlatbox,WEST,EAST,SOUTH,NORTH IFILE</code>.',
        'resolutions': ['15arcmin', '30arcmin', '60arcmin', '120arcmin']
    },
    'select_point': {
        'label': 'Select by point',
        'help': 'The time series is extracted by calculating the grid index for the point'
                ' given by you (e.g. 52.39, 13.06) and the command:'
                ' <code>cdo -s outputtab,date,value,nohead -selindexbox,IX,IX,IY,IY IFILE</code>.',
        'resolutions': ['15arcmin', '30arcmin', '60arcmin', '120arcmin']
    }
}

RESTRICTED_MESSAGES = {}
RESTRICTED_DEFAULT_MESSAGE = 'Please contact <a href="mailto:info@isimip.org">info@isimip.org</a>' \
                             ' if you need access to the dataset.'
