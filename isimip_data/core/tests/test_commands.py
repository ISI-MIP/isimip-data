from django.core.management import call_command


def test_depoy(mocker):
    mocker.patch('subprocess.call')
    call_command('deploy')
