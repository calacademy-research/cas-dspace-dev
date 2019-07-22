import logging
import os
import urllib

from django.http import HttpResponse
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.views import APIView

from .forms import UploadCSVForm
from .models import CSVDocument

from cas_dam_admin import settings

from gcloud_interface.gcloud import Gcloud
# Create your views here.

logging.basicConfig(level=logging.INFO)

# Create your views here.


from django.shortcuts import render

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
    #gcloud_file = 'bigFilewithAll'

    r_base = ['<ul class="jqueryFileTree" style="display: none;">']

    def folder_jquery(self, a, b, c):
        return '<li class="directory collapsed directory-marker"><input type="hidden" name="folderpath" value="%s"><a href="#" rel="%s/">%s</a></li>' % (a, b, c)

    def file_jquery(self, a, b, c):
        return '<li class="file ext_%s"><a href="#" rel="%s">%s</a></li>' % (a, b, c)

    if settings.GOOGLE_DRIVE_ONLY:
        google = Gcloud('gcloud_interface/gcloudAuth/')

    def display_Gcloud_files(self, request):
        try:
            r = self.r_base.copy()
            parent_id = urllib.parse.unquote(request.POST.get('dir'))

            if parent_id == '/':
                # parent_id = self.google.ID_from_name(self.gcloud_file)
                parent_id = 'root'
                parent_metadata = self.google.get_metadata(parent_id)

            else:
                parent_metadata = self.google.get_metadata(parent_id[:-1])

            children = self.google.children_search(parent_metadata['id'], float('inf'))

            for f in children:

                f_name = f['name']
                f_id = f['id']

                if self.google.is_folder(f):
                    r.append(self.folder_jquery(f_id[:-1], f_id, f_name))
                else:
                    r.append(self.file_jquery('', f_id, f_name))

            r.append('</ul>')
        except Exception as e:
            r.append('Could not load directory: %s' % str(e))
        r.append('</ul>')
        return r

    def display_local_files(self, request):

        try:
            r = self.r_base.copy()
            d = urllib.parse.unquote(request.POST.get('dir', '/'))

            for f in os.listdir(d):
                ff = os.path.join(d, f)
                if os.path.isdir(ff):
                    # TODO: DRY https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
                    r.append(self.folder_jquery(ff, ff, f))
                else:
                    e = os.path.splitext(f)[1][1:]  # get .ext and remove dot
                    r.append(self.file_jquery(e, ff, f))

            r.append('</ul>')

        except Exception as e:
            r.append('Could not load directory: %s' % str(e))
        r.append('</ul>')

        return r

    def post(self, request):

        if not settings.GOOGLE_DRIVE_ONLY:
            r = self.display_local_files(request)
        else:
            r = self.display_Gcloud_files(request)

        return HttpResponse(''.join(r), status=status.HTTP_200_OK)








