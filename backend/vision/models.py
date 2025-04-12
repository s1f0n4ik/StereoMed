from django.db import models


class TestResult(models.Model):
    frequency = models.FloatField()  # Частота решетки (цикл/град)
    is_fused = models.BooleanField()  # Фузия успешна?
    timestamp = models.DateTimeField(auto_now_add=True)
