from django.conf.urls import url
from rest_framework.authtoken import views as drf_views
from django.urls import path
from . import views

urlpatterns = [
    path('upload_json', views.upload_json),
    path('get_collections', views.get_collections),
    path('google/childrenSearch/', views.google_get_children, name='gchildSearch'),
    path('local/childrenSearch/', views.local_get_children, name='localChildSearch'),
]

"""
USER: test
EMAIL: test@test.edu
PASS: testadmin


"""