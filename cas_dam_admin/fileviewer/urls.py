from django.urls import path


from . import views
from .views import getFilesystem

urlpatterns = [
    path('', views.index, name='index'),
    path('browser', views.browser, name='browser'),
    path('getfilesystem', getFilesystem.as_view())

]
