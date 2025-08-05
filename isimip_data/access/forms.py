from django import forms

from .models import Token


class AccessForm(forms.ModelForm):

    consent = forms.BooleanField(required=True)

    class Meta:
        model = Token
        fields = ["subject"]
