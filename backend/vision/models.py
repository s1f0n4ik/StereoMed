from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class TestResult(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    freq_left = models.FloatField()
    freq_right = models.FloatField()
    is_fused = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)
    graph_image = models.TextField(blank=True)  # Для хранения base64 графика
