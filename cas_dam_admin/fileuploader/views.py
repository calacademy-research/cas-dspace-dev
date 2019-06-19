from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.conf import settings
from django.core.files.storage import FileSystemStorage

from .models import CSVDocument
from .forms import UploadCSVForm


# Create your views here.

def index(request):
    if request.method == 'POST':
        form = UploadCSVForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = form.save()
            csv_file.save_file_to_model()
            # TODO: riun something when the file uploads
            return redirect('index')
    else:
        form = UploadCSVForm()
    return render(request, 'fileuploader/index.html', {'form': form})
