import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [image, setImage] = useState('');
  const [frequency, setFrequency] = useState(1.0);

  const fetchGrating = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/api/generate-grating/?frequency=${frequency}`);
    setImage(`data:image/png;base64,${response.data.image}`);
  };

  return (
    <div>
      <h1>Тест стереозрения</h1>
      <input
        type="range"
        min="0.5"
        max="30"
        step="0.5"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      />
      <p>Частота: {frequency} цикл/град</p>
      <button onClick={fetchGrating}>Показать решетку</button>
      {image && <img src={image} alt="Синусоидальная решетка" />}
    </div>
  );
}

export default App;