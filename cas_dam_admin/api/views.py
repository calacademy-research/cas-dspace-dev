# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.http import HttpResponse

from .models import Item, SubmittedData

import os
import logging
import json

from cas_dam_admin import settings

from gcloud_interface.gcloud import Gcloud
from dspace_python_wrapper import Dspace

# Create your views here.
dspace_url = settings.DSPACE_URL

if settings.GOOGLE_DRIVE_ONLY:
    google = Gcloud('gcloud_interface/gcloudAuth/')


# TODO: Dash - comment that this is the post to dspace via the api
@api_view(['POST'])
def upload_json(request):
    json_body = request.data

    if not json_body:  # If client sends empty array, respond with 204
        return HttpResponse("Error: empty array received", status=status.HTTP_204_NO_CONTENT)

    new_items = []

    upload_header = {}

    header_seen = False

    # Iterate through json body, set collection UUID if it is found. If it is not found, return 400 bad request
    # Searches for the property collectionUuid: it is unique to the header, so it identifies the header compared to the
    # rest of the uploaded items
    for entry in json_body:
        if not header_seen:  # While the header item has not been seen, search for it in each item.
            # Once it has, don't bother
            if 'collectionUuid' in entry:
                header_seen = True
                for key, value in entry.items():  # Iterate through header properties, add them to upload_header
                    # Fields are: collectionUuid, folderSource, sourcePath
                    upload_header[key] = value
                continue
            else:
                new_items.append(entry)

        # Header won't be added to new items, so add all other entries to new_items
        new_items.append(entry)

    # Responds with a 401 auth error if email or password are missing in the request data.

    if 'email' not in upload_header or 'password' not in upload_header:
        return HttpResponse("Error: email and/or password are missing.", status=status.HTTP_401_UNAUTHORIZED)

    email = upload_header['email']
    password = upload_header['password']

    dspace_controller = Dspace(dspace_url)
    dspace_controller.login(email, password)

    # Verify all the headers are present, return 400 if one or more is missing
    if not all(item in upload_header for item in ['collectionUuid', 'folderSource', 'sourcePath']):
        return HttpResponse("Error: one or more dSpace configuration properties is missing.",
                            status=status.HTTP_400_BAD_REQUEST)

    item_responses = []

    # If new items are empty, else code block is run.

    if not new_items:
        if header_seen:
            return HttpResponse("Error: header received, but no data sent.", status=status.HTTP_204_NO_CONTENT)
        else:
            return HttpResponse("Error: header and data not received", status=status.HTTP_204_NO_CONTENT)

    submitted_data = SubmittedData(upload_user=email, collection_uuid=upload_header['collectionUuid'])
    submitted_data.save()

    for item in new_items:

        response_uuid, response_data = dspace_controller.register_new_item_from_json(item,
                                                                                     upload_header['collectionUuid'])
        print(response_uuid)
        if response_uuid is None:  # Empty rows should be ignored and not added to item_responses
            continue

        item_responses.append((item, response_uuid, response_data))

        item_model = Item(source_submission=submitted_data, uuid=response_uuid, metadata=json.dumps(item))
        item_model.save()

    logging.info(json_body)

    if item_responses == []:
        return HttpResponse("Error: none of the rows were valid.", status=status.HTTP_204_NO_CONTENT)

    for item, response_uuid, response_data in item_responses:
        if upload_header['folderSource'] == 'gdrive':
            # Do something
            # google.upload_to_dspace(dspace_controller, , )
            pass
        elif upload_header['folderSource'] == 'slevin':
            # Set absolute filepath
            if upload_header['sourcePath'] is None:
                upload_header['sourcePath'] = ""
            filepath = os.path.join(upload_header['sourcePath'],
                                    item['filename'])

            # Set filename. If ibss-library.filename exists, use it. Otherwise, use end of filename given in csv
            if 'ibss-library.filename' in item and item['ibss-library.filename'] != '':
                filename = item['ibss-library.filename']

            else:
                filename = os.path.basename(item['filename'])

            dspace_controller.add_bitstream_to_item(filepath, filename, response_uuid)
            # Update each item with the filepath.
            # We can't do this earlier, as we generate the filepath when uploading the bitstream.
            Item.objects.filter(pk=response_uuid).update(filepath=filepath)

    return HttpResponse(status=status.HTTP_200_OK)


@api_view(['POST'])
def test_login_credentials(request):
    data = json.loads(request.body)

    email = data['email']
    password = data['password']

    dspace_controller = Dspace(dspace_url)
    is_logged_in = dspace_controller.login(email, password)

    return HttpResponse(is_logged_in, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_collections(request):
    dspace_controller = Dspace(dspace_url)
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

    # if the length of children is greater than 0, this file must have already been used
    # in an api request so it already has all the children.
    # There is no other way to populate the children variable other than to make
    # an api request to this endpoint.
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
    }
    # This line now checks if it has been previously determined a folder before making any google api calls.
    if file_is_folder or google.is_folder(google.get_metadata(file_id)):
        children = google.children_search(file_id)
        responseData['is_folder'] = True
        responseData['children'] = filterGChildrenResponse(children)

    return JsonResponse(responseData)


def filterGChildrenResponse(children):
    """ When a gcloud file is requested, there is an excess of metadata on the file that is unneeded.
    This function filters all that information out by creating a new dictionary with only the needed information

    :param children: list of gcloud file objects
    :return: list of filtered gcloud file objects
    """
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
        'filepath': filepath,
    }

    if file_is_folder:
        responseData['is_folder'] = True
        responseData['children'] = []
        children = os.listdir(filepath)
        children.sort()

        for child in children:
            childObject = {}
            permission = True
            childObject['name'] = child
            if filepath == '/':
                childObject['filepath'] = filepath + child
            else:
                childObject['filepath'] = filepath + '/' + child

            childObject['is_folder'] = os.path.isdir(childObject['filepath'])

            if childObject['is_folder']:
                childObject['children'] = []
                try:
                    os.listdir(childObject['filepath'])

                except PermissionError:
                    permission = False

            if permission:
                responseData['children'].append(childObject)

    return JsonResponse(responseData)


@api_view(['POST'])
def validate_paths(request):
    paths = request.data['filenames']
    source = request.data['source']
    response = {'validations': [os.path.isfile(source + path['value']) for path in paths]}
    return JsonResponse(response)
