# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.http import HttpResponse

import os
import json

from cas_dam_admin import settings

from gcloud_interface.gcloud import Gcloud
from dspace_python_wrapper import Dspace

# Create your views here.
if settings.GOOGLE_DRIVE_ONLY:
    google = Gcloud('gcloud_interface/gcloudAuth/')


@api_view(['POST'])
def upload_json(request):
    json_body = request.data
    if not json_body:  # If client sends empty array
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

    dspace_controller = Dspace('http://localhost:8080/rest')

    for item in json_body:
        dspace_controller.register_new_item_from_json(item)
    print(json_body)

    return HttpResponse(status=status.HTTP_200_OK)


@api_view(['GET'])
def get_collections(request):
    dspace_controller = Dspace('http://localhost:8080/rest')
    collections = dspace_controller.get_data_from_dspace('collections')
    return Response(collections, status=status.HTTP_200_OK)


@api_view(['POST'])
def google_get_children(request):
    """ This function/api call returns a json containing the updated information about a given file.

    Getting filepath takes too long, no longer returning full path.

    :param request:
    :return: JSON containing updated information of file, including children from gcloud api.
    """

    file_id = request.data['id']
    file_name = request.data['name']
    file_is_folder = request.data['is_folder']

    try:
        if len(request.data['children']) > 0:
            return JsonResponse(request.data)

    except KeyError:
        pass

    responseData = {
        'id': file_id,
        'toggled': False,
        'active': True,
        'name': file_name,
        'updated': False,
    }
    # This line now checks if it has been previously determined a folder before making any google api calls.
    if file_is_folder or google.is_folder(google.get_metadata(file_id)):
        children = google.children_search(file_id)
        responseData['is_folder'] = True
        responseData['children'] = filterGChildrenResponse(children)
        responseData['updated'] = True

    return JsonResponse(responseData)


def filterGChildrenResponse(children):
    filteredChildren = []

    for child in children:

        filteredChildObject = {}

        filteredChildObject['id'] = child['id']
        filteredChildObject['name'] = child['name']

        if google.is_folder(child):
            filteredChildObject['children'] = []
            filteredChildObject['is_folder'] = True
        else:
            filteredChildObject['is_folder'] = False

        filteredChildren.append(filteredChildObject)

    return filteredChildren


@api_view(['POST'])
def local_get_children(request):
    file_name = request.data['name']
    file_is_folder = request.data['is_folder']
    filepath = request.data['filepath']

    try:
        if len(request.data['children']) > 0:
            return JsonResponse(request.data)

    except KeyError:
        pass

    responseData = {
        'toggled': False,
        'active': True,
        'name': file_name,
        'updated': False,
        'filepath': filepath,
    }

    if file_is_folder:
        children = os.listdir(filepath)
        responseData['is_folder'] = True
        responseData['children'] = []

        for child in children:
            childObject = {}

            childObject['name'] = child
            if filepath == '/':
                childObject['filepath'] = filepath + child
            else:
                childObject['filepath'] = filepath + '/' + child

            childObject['is_folder'] = os.path.isdir(childObject['filepath'])
            if childObject['is_folder']:
                childObject['children'] = []
            responseData['children'].append(childObject)

        responseData['updated'] = True

    return JsonResponse(responseData)
