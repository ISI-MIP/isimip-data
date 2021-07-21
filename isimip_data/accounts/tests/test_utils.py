from django.contrib.auth.models import User

from ..utils import get_full_name


def test_get_full_name():
    user = User(username='test', first_name='Tommy', last_name='Test')
    assert get_full_name(user) == 'Tommy Test'


def test_get_full_name_username():
    user = User(username='test')
    assert get_full_name(user) == 'test'
