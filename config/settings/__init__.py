from split_settings.tools import include, optional

include(
    'base.py',
    optional('local*.py'),
    optional('local_*.py'),
)
