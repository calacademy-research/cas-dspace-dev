from django.urls import path
from . import views

urlpatterns = [
    path('', views.show_all_history, name='index'),
    path('<int:submission_id>/', views.submission_detail, name='detail'),
    path('<int:submission_id>/undo', views.undo_submission, name='undo') # Not sure if this works
]
