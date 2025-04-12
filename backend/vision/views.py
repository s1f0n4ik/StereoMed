from rest_framework.decorators import api_view
from rest_framework.response import Response
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
