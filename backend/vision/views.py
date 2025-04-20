from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Subject, TestResult
import matplotlib.pyplot as plt
from .utils import generate_anaglyph_grating
import base64
import cv2
import io


@api_view(['GET'])
def generate_stereo_grating(request):
    freq_left = float(request.GET.get('freq_left', 1.0))
    freq_right = float(request.GET.get('freq_right', 1.0))

    image = generate_anaglyph_grating(freq_left, freq_right)
    _, buffer = cv2.imencode('.png', image)
    image_base64 = base64.b64encode(buffer).decode('utf-8')

    return Response({
        'image': image_base64,
        'freq_left': freq_left,
        'freq_right': freq_right
    })


@api_view(['GET'])
def get_test_results(request):
    subject_name = request.GET.get('subject')
    if not subject_name:
        return Response({'error': 'Subject name is required'}, status=400)

    subject = Subject.objects.filter(name=subject_name).first()
    if not subject:
        return Response({'error': 'Subject not found'}, status=404)

    results = TestResult.objects.filter(subject=subject).order_by('freq_left')
    data = [{
        'freq_left': r.freq_left,
        'freq_right': r.freq_right,
        'is_fused': r.is_fused,
        'timestamp': r.timestamp
    } for r in results]

    return Response(data)


@api_view(['POST'])
def save_test_result(request):
    try:
        subject, _ = Subject.objects.get_or_create(
            name=request.data.get('subject_name'),
            defaults={
                'age': request.data.get('age', 0),
                'notes': request.data.get('notes', '')
            }
        )

        test_result = TestResult.objects.create(
            subject=subject,
            freq_left=request.data.get('freq_left'),
            freq_right=request.data.get('freq_right'),
            is_fused=request.data.get('is_fused'),
        )

        return Response({
            'status': 'success',
            'result_id': test_result.id
        })

    except Exception as e:
        return Response({'error': str(e)}, status=400)


def generate_fusion_graph(subject_id):
    """Генерирует график результатов теста"""
    results = TestResult.objects.filter(subject_id=subject_id).order_by('freq_left')

    if not results:
        return ""

    frequencies = [abs(r.freq_left - r.freq_right) for r in results]
    fusion_results = [int(r.is_fused) for r in results]

    plt.figure(figsize=(10, 5))
    plt.plot(frequencies, fusion_results, 'bo-')
    plt.title('Зависимость фузии от разницы частот')
    plt.xlabel('Разница частот (цикл/град)')
    plt.ylabel('Фузия (1-есть, 0-нет)')
    plt.grid(True)

    # Конвертируем в base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    graph_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()

    return graph_base64
