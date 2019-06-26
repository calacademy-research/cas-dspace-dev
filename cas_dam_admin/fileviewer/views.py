import logging
import os
import urllib

from django.http import HttpResponse
from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.views import APIView

from .forms import UploadCSVForm
from .models import CSVDocument

from cas_dam_admin import settings

from fileviewer.gcloud_interface.gcloud import Gcloud
# Create your views here.

logging.basicConfig(level=logging.INFO)

# Create your views here.
def index(request):
    if request.method == 'POST':
        form = UploadCSVForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file: CSVDocument = form.save()
            csv_file.save_file_to_model()
            csv_file.log_csv_contents()
            csv_file.upload_csv_to_dspace()
            return redirect('index')
    else:
        form = UploadCSVForm()
    return render(request, 'fileviewer/index.html', {'form': form})


def browser(request):
    return render(request, 'fileviewer/browser.html')


class GetFilesystem(APIView):
    """ Opens a root folder and walks through it, generates a jqueryFileTree compatible html file

    :returns HttpResponse
    """

    if settings.GOOGLE_DRIVE_ONLY:
        google = Gcloud('fileviewer/gcloud_interface/')

    def post(self, request):

        if not self.GoogleCloud:
            try:
                r = ['<ul class="jqueryFileTree" style="display: none;">']
                d = urllib.parse.unquote(request.POST.get('dir', '/'))
                for f in os.listdir(d):
                    ff = os.path.join(d, f)
                    if os.path.isdir(ff):
                        r.append(
                            '<li class="directory collapsed"><input type="radio" name="folderpath" value="%s"><a href="#" rel="%s/">%s</a></li>' % (
                                ff, ff, f))
                    else:
                        e = os.path.splitext(f)[1][1:]  # get .ext and remove dot
                        r.append(
                            '<li class="file ext_%s"><a href="#" rel="%s">%s</a></li>' % (
                                e, ff, f))
                r.append('</ul>')
            except Exception as e:
                r.append('Could not load directory: %s' % str(e))
            r.append('</ul>')
            return HttpResponse(''.join(r), status=status.HTTP_200_OK)

        else:
            try:
                r = ['<ul class="jqueryFileTree" style="display: none;">']
                parent_id = urllib.parse.unquote(request.POST.get('dir'))

                if parent_id == '/':
                    parent_id = self.google.ID_from_name('bigFilewithAll')
                    parent_metadata = self.google.get_metadata(parent_id)

                else:
                    parent_metadata = self.google.get_metadata(parent_id[:-1])

                children = self.google.children_search(parent_metadata['id'], float('inf'))

                for f in children:
                    f_name = f['name']
                    f_id = f['id']
                    if self.google.is_folder(f):
                        r.append(
                            '<li class="directory collapsed"><input type="radio" name="folderpath" value="%s"><a href="#" rel="%s/">%s</a></li>' % (
                                self.google.get_filepath_from_file(f), f_id, f_name))
                    else:
                        # e = f['fileExtension']  # get .ext and remove dot
                        r.append(
                            '<li class="file ext_%s"><a href="#" rel="%s">%s</a></li>' % (
                                '', f_id, f_name))
                r.append('</ul>')
            except Exception as e:
                print(e)
                r.append('Could not load directory: %s' % str(e))
            r.append('</ul>')
            return HttpResponse(''.join(r), status=status.HTTP_200_OK)




