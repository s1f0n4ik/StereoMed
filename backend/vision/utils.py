import numpy as np
import cv2


def generate_sinusoidal_grating(frequency=1.0, width=800, height=600):
    x = np.arange(width)
    y = np.arange(height)
    xx, yy = np.meshgrid(x, y)
    grating = np.sin(2 * np.pi * frequency * xx / width)
    grating = (grating * 127 + 127).astype(np.uint8)  # Преобразуем в 8-битное изображение
    return cv2.cvtColor(grating, cv2.COLOR_GRAY2BGR)  # Конвертируем в BGR для OpenCV
