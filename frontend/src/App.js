import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FusionChart from './FusionChart';

function App() {
    const [subject, setSubject] = useState({ name: '', age: '' });
    const [freqLeft, setFreqLeft] = useState(1.0);
    const [freqRight, setFreqRight] = useState(1.0);
    const [testHistory, setTestHistory] = useState([]);
    const [stereoImage, setStereoImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Загрузка стереоизображения
    const loadStereoImage = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/generate-stereo-grating/?freq_left=${freqLeft}&freq_right=${freqRight}`
            );
            setStereoImage(`data:image/png;base64,${response.data.image}`);
        } catch (error) {
            console.error("Ошибка загрузки изображения:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Сохранение результата теста
    const saveResult = async (isFused) => {
        if (!subject.name) {
            alert("Введите имя испытуемого");
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/save-test-result/', {
                subject_name: subject.name,
                age: subject.age,
                freq_left: freqLeft,
                freq_right: freqRight,
                is_fused: isFused
            });
            loadTestHistory();
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        }
    };

    // Загрузка истории тестов
    const loadTestHistory = async () => {
        if (!subject.name) return;

        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/test-results/?subject=${subject.name}`
            );
            setTestHistory(response.data);
        } catch (error) {
            console.error("Ошибка загрузки истории:", error);
        }
    };

    // Автоматическая загрузка изображения при изменении частот
    useEffect(() => {
        loadStereoImage();
    }, [freqLeft, freqRight]);

    return (
        <div className="app" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Тест стереозрения</h1>

            {/* Форма ввода данных испытуемого */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h2>Данные испытуемого</h2>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={subject.name}
                        onChange={(e) => setSubject({...subject, name: e.target.value})}
                        style={{ padding: '8px', width: '100%' }}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Возраст"
                        value={subject.age}
                        onChange={(e) => setSubject({...subject, age: e.target.value})}
                        style={{ padding: '8px', width: '100%' }}
                    />
                </div>
            </div>

            {/* Управление тестом */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h2>Параметры теста</h2>

                <div style={{ marginBottom: '15px' }}>
                    <label>Частота (левый глаз, красный): {freqLeft} цикл/град</label>
                    <input
                        type="range"
                        min="0.5"
                        max="30"
                        step="0.1"
                        value={freqLeft}
                        onChange={(e) => setFreqLeft(parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Частота (правый глаз, голубой): {freqRight} цикл/град</label>
                    <input
                        type="range"
                        min="0.5"
                        max="30"
                        step="0.1"
                        value={freqRight}
                        onChange={(e) => setFreqRight(parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <button
                    onClick={() => loadStereoImage()}
                    style={{ marginRight: '10px', padding: '8px 15px' }}
                >
                    Обновить изображение
                </button>
            </div>

            {/* Отображение стереоизображения */}
            {isLoading ? (
                <p>Загрузка изображения...</p>
            ) : stereoImage && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h2>Стереоизображение</h2>
                    <p>Используйте анаглифические очки (красный-левый, голубой-правый)</p>
                    <img
                        src={stereoImage}
                        alt="Стереоизображение"
                        style={{
                            maxWidth: '100%',
                            border: '1px solid #ddd',
                            marginBottom: '10px'
                        }}
                    />

                    <div>
                        <button
                            onClick={() => saveResult(true)}
                            style={{
                                marginRight: '10px',
                                padding: '8px 15px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Фузия есть
                        </button>
                        <button
                            onClick={() => saveResult(false)}
                            style={{
                                padding: '8px 15px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Фузии нет
                        </button>
                    </div>
                </div>
            )}

            {/* Отображение результатов */}
            {testHistory.length > 0 && (
                <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <h2>Результаты тестирования</h2>
                    <FusionChart testData={testHistory} />

                    <div style={{ marginTop: '20px' }}>
                        <h3>История тестов</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Разница частот</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Результат</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testHistory.map((test, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            {Math.abs(test.freq_left - test.freq_right).toFixed(1)} цикл/град
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            {test.is_fused ? '✅ Есть' : '❌ Нет'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;