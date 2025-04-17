from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        call_command('npm', 'ci')
        call_command('npm', 'run', 'build:prod')
        call_command('collectstatic', '--noinput', '--clear')
        call_command('clear_cache')
