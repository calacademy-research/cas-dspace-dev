from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, 'build/index.html')
