
from django.urls import path
from .views import upload

app_name = 'record'

urlpatterns = [
    path('', upload),
]
