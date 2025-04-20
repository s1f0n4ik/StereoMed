import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function FusionChart({ testData }) {
    const data = {
        labels: testData.map(item =>
            `Δ=${Math.abs(item.freq_left - item.freq_right).toFixed(1)}`),
        datasets: [
            {
                label: 'Фузия',
                data: testData.map(item => item.is_fused ? 1 : 0),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointRadius: 8
            }
        ]
    };

    const options = {
        scales: {
            y: {
                min: 0,
                max: 1,
                ticks: {
                    callback: value => value ? '✅ Есть' : '❌ Нет'
                }
            }
        }
    };

    return <Line data={data} options={options} />;
}