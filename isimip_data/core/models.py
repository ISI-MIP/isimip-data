from django.db.models import Func


class JsonObjectKeys(Func):
    function = 'jsonb_object_keys'
