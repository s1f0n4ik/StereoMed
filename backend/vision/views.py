from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import TestResult
from .utils import generate_sinusoidal_grating
import base64
import cv2


@api_view(['GET'])
def generate_grating(request):
    frequency = float(request.GET.get('frequency', 1.0))
    image = generate_sinusoidal_grating(frequency)
    _, buffer = cv2.imencode('.png', image)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    return Response({'image': image_base64, 'frequency': frequency})


@api_view(['POST'])
def save_result(request):
    frequency = float(request.data.get('frequency'))
    is_fused = bool(request.data.get('is_fused'))
    TestResult.objects.create(frequency=frequency, is_fused=is_fused)
    return Response({'status': 'ok'})


@api_view(['GET'])
def get_results(request):
    results = TestResult.objects.all().order_by('frequency')
    data = [{'frequency': r.frequency, 'is_fused': r.is_fused} for r in results]
    return Response(data)
