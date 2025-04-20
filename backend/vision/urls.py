from django.urls import path
from . import views

urlpatterns = [
    path('generate-stereo-grating/', views.generate_stereo_grating, name='generate_grating'),
    path('save-test-result/', views.save_test_result, name='save_result'),
    path('test-results/', views.get_test_results, name='get_results'),
]
