import numpy as np
import cv2


def generate_anaglyph_grating(freq_left=1.0, freq_right=1.0, width=800, height=600):
    """Генерация анаглифического изображения (красный/голубой)"""
    # Создаем решетки для каждого глаза
    x = np.arange(width)
    y = np.arange(height)
    xx, yy = np.meshgrid(x, y)

    # Левая решетка (красный канал)
    left_grating = np.sin(2 * np.pi * freq_left * xx / width)
    left_grating = (left_grating * 127 + 127).astype(np.uint8)

    # Правая решетка (голубой канал: синий + зеленый)
    right_grating = np.sin(2 * np.pi * freq_right * xx / width + np.pi / 4)  # Сдвиг фазы
    right_grating = (right_grating * 127 + 127).astype(np.uint8)

    # Комбинируем в анаглиф
    anaglyph = np.zeros((height, width, 3), dtype=np.uint8)
    anaglyph[:, :, 0] = right_grating  # Красный (левый глаз)
    anaglyph[:, :, 1] = right_grating  # Зеленый (правый глаз)
    anaglyph[:, :, 2] = right_grating  # Синий (правый глаз)
    anaglyph[:, :, 0] = left_grating  # Перезаписываем красный канал

    return anaglyph