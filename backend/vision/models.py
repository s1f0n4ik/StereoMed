from django.db import models

class TestResult(models.Model):
    frequency = models.FloatField()  # Частота решетки
    is_fused = models.BooleanField()  # Успешность фузии
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.frequency} цикл/град: {'Да' if self.is_fused else 'Нет'}"
