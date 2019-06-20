from django import forms

from .models import CSVDocument


class UploadCSVForm(forms.ModelForm):
    class Meta:
        model = CSVDocument
        fields = ('document', 'path')
        widgets = {
            'document': forms.FileInput(attrs={'accept': '.csv'}),
            'path': forms.TextInput(attrs={'id': 'path-input-box'})
        }
