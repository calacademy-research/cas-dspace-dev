from django import forms

from dspace_python_wrapper import Dspace

from .models import CSVDocument


class UploadCSVForm(forms.ModelForm):
    class Meta:
        model = CSVDocument
        fields = ('document', 'path', 'collection_uuid', 'email', 'password')
        widgets = {
            'document': forms.FileInput(attrs={'accept': '.csv'}),
            'path': forms.TextInput(attrs={'class': 'input-box', 'id': 'path-input-box'}),
            'email': forms.TextInput(attrs={'class': 'input-box'}),
            'password': forms.TextInput(attrs={'class': 'input-box', 'type': 'password'})
        }

    def __init__(self, *args, **kwargs):
        super(UploadCSVForm, self).__init__(*args, **kwargs)
        list_of_collections = Dspace('http://localhost:8080/rest').get_data_from_dspace('collections')
        list_of_collections = [(v, k) for k, v in
                               list_of_collections.items()]  # get_data_from_dspace returns a dict, converting to tuples
        self.fields['collection_uuid'].widget = forms.Select(choices=list_of_collections)
