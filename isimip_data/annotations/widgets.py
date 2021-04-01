import json

from django import forms

from isimip_data.metadata.models import Attribute


class SpecifierWidget(forms.Widget):
    template_name = 'annotations/widgets/caveat_specifier_widget.html'

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['widget']['attributes'] = Attribute.objects.using('metadata').all()
        return context

    def value_from_datadict(self, data, files, name):
        value = {}
        for key, values in data.lists():
            if key.startswith('specifiers_'):
                value[key.replace('specifiers_', '')] = values
        return json.dumps(value)

    def value_omitted_from_data(self, data, files, name):
        return False

    def format_value(self, value):
        if value == 'null':
            return {}
        else:
            data = json.loads(value)
            checked = []
            for key, values in data.items():
                checked += ['id_specifiers_{}_{}'.format(key, value) for value in values]
            return checked
