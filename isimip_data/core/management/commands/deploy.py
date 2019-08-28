import subprocess

from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        subprocess.call(['/bin/bash', '-i', '-c', 'nvm install; npm install; npm run build:prod'])
        call_command('collectstatic', '--noinput')
