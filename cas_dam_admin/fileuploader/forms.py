from django import forms
from .models import CSVDocument


class DocumentForm(forms.ModelForm):
    class Meta:
        model = CSVDocument
        fields = ('document', )
        widgets = {
            'document': forms.FileInput(attrs={'accept': '.csv'})
        }
