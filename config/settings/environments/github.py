DEBUG = False

SECRET_KEY = 'this is not a very secret key'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'isimip_data',
        'USER': 'postgres',
        'PASSWORD': 'postgres_password',
        'HOST': '127.0.0.1'
    },
    'metadata': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'isimip_metadata',
        'USER': 'postgres',
        'PASSWORD': 'postgres_password',
        'HOST': '127.0.0.1'
    }
}

FILES_BASE_URL = 'http://isimip/'

PROTOCOL_LOCATIONS = ['testing/protocol']
