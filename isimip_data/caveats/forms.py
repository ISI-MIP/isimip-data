from django import forms

from isimip_data.metadata.models import Dataset

from .models import Caveat


class CaveatForm(forms.ModelForm):

    use_required_attribute = False

    dataset_id = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = Caveat
        fields = ('title', 'description')

    def __init__(self, *args, **kwargs):
        self.creator = kwargs.pop('creator')
        self.dataset_id = kwargs.pop('dataset_id')

        super().__init__(*args, **kwargs)

        self.fields['dataset_id'].initial = self.dataset_id

    def save(self, *args, **kwargs):
        self.instance.creator = self.creator
        self.instance.severity = self.instance.SEVERITY_MEDIUM
        self.instance.status = self.instance.STATUS_NEW
        self.instance.public = False

        dataset_id = self.cleaned_data.get('dataset_id')
        if dataset_id:
            try:
                dataset = Dataset.objects.using('metadata').get(id=dataset_id)
                self.instance.version_after = dataset.version
                self.instance.specifiers = {
                    identifier: [specifier]
                    for identifier, specifier in dataset.specifiers.items()
                }
            except Dataset.DoesNotExist:
                pass

        self.instance.save()
        return self.instance
