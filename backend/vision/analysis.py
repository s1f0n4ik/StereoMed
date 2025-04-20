def calculate_fusion_threshold(results):
    """
    Определяет порог фузии методом границ.
    Возвращает частоту, на которой фузия перестает работать.
    """
    if not results:
        return None

    sorted_results = sorted(results, key=lambda x: x['frequency'])
    threshold = None

    for i in range(1, len(sorted_results)):
        prev = sorted_results[i - 1]
        curr = sorted_results[i]

        if prev['is_fused'] and not curr['is_fused']:
            threshold = (prev['frequency'] + curr['frequency']) / 2
            break

    return threshold


def advanced_threshold_detection(results):
    """Использует линейную интерполяцию для точного определения порога"""
    positives = [r for r in results if r['is_fused']]
    negatives = [r for r in results if not r['is_fused']]

    if not positives or not negatives:
        return None

    last_positive = max(positives, key=lambda x: x['frequency'])
    first_negative = min(negatives, key=lambda x: x['frequency'])

    return (last_positive['frequency'] + first_negative['frequency']) / 2


def detect_stereo_threshold(test_results):
    """Определяет максимальную разницу частот, при которой сохраняется стереоэффект"""
    successful_tests = [
        (r.freq_left, r.freq_right)
        for r in test_results
        if r.is_fused
    ]

    if not successful_tests:
        return 0

    max_diff = max(
        abs(left - right)
        for left, right in successful_tests
    )

    return max_diff
