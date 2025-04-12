from django.urls import path
from . import views

urlpatterns = [
    path('generate-grating/', views.generate_grating, name='generate_grating'),
]
