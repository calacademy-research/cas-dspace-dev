from django.urls import path


from . import views
from .views import GetFilesystem

urlpatterns = [
    path('', views.index, name='index'),
    path('browser', views.browser, name='browser'),
    path('getfilesystem', GetFilesystem.as_view()),
    # path('sendfolders/', views.sendfolders, name='sendfolders'),
]
