import os
import os
import urllib
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status


# Create your views here.

def index(request):
    return HttpResponse("You're at the index page of fileviewer!")


def browser(request):
    return render(request, 'fileviewer/browser.html')


class GetFilesystem(APIView):
    """
    Opens a root folder and walks through it, generates a jqueryFileTree compatible html file

    :returns HttpResponse
    """
    def post(self, request):
        print(request)
        r = ['<ul class="jqueryFileTree" style="display: none;">']
        try:
            r = ['<ul class="jqueryFileTree" style="display: none;">']
            d = urllib.parse.unquote(request.POST.get('dir', '/'))
            for f in os.listdir(d):
                ff = os.path.join(d, f)
                if os.path.isdir(ff):
                    r.append('<li class="directory collapsed"><a href="#" rel="%s/">%s</a></li>' % (ff, f))
                else:
                    e = os.path.splitext(f)[1][1:]  # get .ext and remove dot
                    r.append('<li class="file ext_%s"><a href="#" rel="%s">%s</a></li>' % (e, ff, f))
            r.append('</ul>')
        except Exception as e:
            r.append('Could not load directory: %s' % str(e))
        r.append('</ul>')
        return HttpResponse(''.join(r), status=status.HTTP_200_OK)
