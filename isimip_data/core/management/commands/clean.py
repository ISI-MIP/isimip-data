import os
import shutil

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('command', choices=[
            'all',
            'media',
            'npm',
            'python',
            'static',
        ])

    def handle(self, *args, **options):
        if options['command'] in ['all', 'media']:
            self.clean_media()
        if options['command'] in ['all', 'npm']:
            self.clean_npm()
        if options['command'] in ['all', 'static']:
            self.clean_static()
        if options['command'] in ['all', 'python']:
            self.clean_python()

    def clean_media(self):
        shutil.rmtree(settings.MEDIA_ROOT, ignore_errors=True)
        print(f'Directory "{settings.MEDIA_ROOT}" has been removed!')

    def clean_npm(self):
        shutil.rmtree('node_modules', ignore_errors=True)
        print('Directory "node_modules" has been removed!')

    def clean_python(self):
        call_command('clean_pyc')
        for root, dirs, files in os.walk('.'):
            for dir_name in dirs:
                if dir_name == '__pycache__':
                    os.rmdir(os.path.join(root, dir_name))

    def clean_static(self):
        shutil.rmtree(settings.STATIC_ROOT, ignore_errors=True)
        print(f'Directory "{settings.STATIC_ROOT}" has been removed!')

        for staticfiles_dir in settings.STATICFILES_DIRS:
            shutil.rmtree(staticfiles_dir, ignore_errors=True)
            os.makedirs(staticfiles_dir)
            print(f'Directory "{staticfiles_dir}" has been emptied!')
