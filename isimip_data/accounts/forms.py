from django import forms
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _


class ProfileForm(forms.ModelForm):

    use_required_attribute = False

    class Meta:
        model = User
        fields = ('first_name', 'last_name')


class DeleteProfileForm(forms.Form):

    use_required_attribute = False

    email = forms.CharField(widget=forms.TextInput(attrs={'required': 'false'}))
    email.label = _('Email')
    email.widget.attrs = {'class': 'form-control', 'placeholder': email.label}

    password = forms.CharField(widget=forms.PasswordInput)
    password.label = _('Password')
    password.widget.attrs = {'class': 'form-control', 'placeholder': password.label}

    consent = forms.BooleanField(required=True)
    consent.label = _('I confirm that I want my account to be completely removed.')


class SignupForm(ProfileForm):

    pass
