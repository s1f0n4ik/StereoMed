import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [image, setImage] = useState('');
  const [frequency, setFrequency] = useState(1.0);
  const [isFused, setIsFused] = useState(null);
  const [threshold, setThreshold] = useState(null);
  const [testHistory, setTestHistory] = useState([]);

  const fetchGrating = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/generate-grating/?frequency=${frequency}`
      );
      setImage(`data:image/png;base64,${response.data.image}`);
      setIsFused(null); // Сброс ответа при новой частоте
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  const saveResult = async (fused) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/save-result/', {
        frequency: frequency,
        is_fused: fused
      });
      setIsFused(fused);
      loadResults(); // Обновляем историю тестов
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const loadResults = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get-results/');
      setTestHistory(response.data);
      calculateThreshold(response.data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  const calculateThreshold = (results) => {
    if (results.length < 2) return;

    // Имитация простого алгоритма определения порога
    const failedTest = results.find(r => !r.is_fused);
    if (failedTest) {
      setThreshold(failedTest.frequency);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Тест стереозрения</h1>

      <div>
        <label>Частота:
          <input
            type="range"
            min="0.5"
            max="30"
            step="0.5"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
          />
          {frequency} цикл/град
        </label>
        <button onClick={fetchGrating}>Показать решетку</button>
      </div>

      {image && (
        <div>
          <img src={image} alt="Синусоидальная решетка" style={{ margin: '20px 0' }}/>
          <div>
            <button onClick={() => saveResult(true)} style={{ marginRight: '10px' }}>
              Вижу фузию
            </button>
            <button onClick={() => saveResult(false)}>
              Не вижу фузию
            </button>
          </div>
        </div>
      )}

      {isFused !== null && (
        <p>Ваш ответ: {isFused ? "✅ Фузия есть" : "❌ Фузии нет"}</p>
      )}

      {threshold && (
        <div style={{ marginTop: '30px', padding: '15px', background: '#f0f0f0' }}>
          <h3>Результаты теста</h3>
          <p>Порог фузии: <strong>{threshold.toFixed(1)} цикл/град</strong></p>
          <ul>
            {testHistory.map((test, index) => (
              <li key={index}>
                {test.frequency} цикл/град: {test.is_fused ? "✅" : "❌"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;