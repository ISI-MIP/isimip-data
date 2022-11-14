import subprocess

from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        subprocess.call(['/bin/bash', '-i', '-c', 'nvm use; npm run watch'])
