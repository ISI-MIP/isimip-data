from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

from isimip_data.metadata.models import Dataset

from .models import Caveat, Comment


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
        self.instance.public = self.creator.is_staff

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


class CommentForm(forms.ModelForm):

    use_required_attribute = False
    caveat_id = forms.IntegerField(widget=forms.HiddenInput())

    class Meta:
        model = Comment
        fields = ('text', )

    def __init__(self, *args, **kwargs):
        self.caveat = kwargs.pop('caveat', None)
        self.creator = kwargs.pop('creator', None)

        super().__init__(*args, **kwargs)

        self.fields['text'].label = False
        self.fields['text'].widget.attrs['placeholder'] = _('Leave a comment')
        self.fields['text'].widget.attrs['rows'] = 6
        self.fields['caveat_id'].initial = self.caveat.id if self.caveat else None

    def save(self, *args, **kwargs):
        self.instance.caveat_id = self.cleaned_data.get('caveat_id')
        self.instance.creator = self.creator
        self.instance.public = True

        self.instance.save()
        return self.instance


class AnnouncementAdminForm(forms.Form):
    subject = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'vLargeTextField',
        'rows': 2
    }), required=True)
    message = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'vLargeTextField',
        'rows': 20
    }), required=True)
    recipients = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'vLargeTextField',
        'rows': 4
    }), required=True, help_text=_('You can add multiple recipients line by line.'))

    def __init__(self, *args, **kwargs):
        self.object = kwargs.pop('object')
        super().__init__(*args, **kwargs)

    def clean_recipients(self):
        recipients = self.cleaned_data['recipients'].splitlines()
        for recipient in recipients:
            validate_email(recipient)
        return recipients

    def clean(self):
        if self.object.email:
            raise ValidationError(_('No email can been send, since the email flag was set before.'))
