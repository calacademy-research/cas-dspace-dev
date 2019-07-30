from django.shortcuts import render, get_object_or_404, redirect
from rest_framework.decorators import api_view
from django.http import HttpResponse
from api.models import SubmittedData, Item

from dspace_python_wrapper import Dspace


# Create your views here.

def show_all_history(request):
    all_submission_ids = SubmittedData.objects.all().values('pk')

    latest_submissions_list = SubmittedData.objects.order_by('-pk')

    context = {'list_of_submissions': latest_submissions_list}

    return render(request, 'history/all_history.html', context)


def submission_detail(request, submission_id):
    submission = get_object_or_404(SubmittedData, pk=submission_id)

    submission_uuids = get_item_uuids_from_submission_pk(submission_id)

    context = {'submission': submission, 'list_of_uuids': submission_uuids}

    return render(request, 'history/detail.html', context)


def get_item_uuids_from_submission_pk(pk):
    """Creates a list of the item uuids associated with a submission id

    """

    # Iterate through list of submission ids and get lists of uuids linked to the submission
    list_of_submission_uuids = Item.objects.filter(source_submission__pk=pk).values_list('uuid', flat=True)

    display_list = [uuid for uuid in list_of_submission_uuids]

    return display_list


@api_view(['POST'])
def undo_submission(request, submission_id):
    list_of_uuids = get_item_uuids_from_submission_pk(submission_id)

    delete_uuids_from_dspace(list_of_uuids)

    return redirect('index')


def delete_uuids_from_dspace(list_of_uuids):
    email = 'test@test.edu'
    password = 'admin'
    dspace_controller = Dspace('http://localhost:8080/rest')
    dspace_controller.login(email, password)

    delete_responses = []

    for uuid in list_of_uuids:
        response = dspace_controller.delete_data_from_dspace('item', uuid)
        delete_responses.append(response)
