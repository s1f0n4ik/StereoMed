from django.urls import path
from . import views

urlpatterns = [
    path('generate-grating/', views.generate_grating, name='generate_grating'),
    path('save-result/', views.save_result, name='save_result'),
    path('get-results/', views.get_results, name='get_results'),
]
