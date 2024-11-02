// src/components/BarChart.js
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

const BarChart = ({ chartData }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    // Registra los componentes necesarios
    Chart.register(...registerables);
    
    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar', // Tipo de gráfico
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Mi Dataset',
          data: chartData.values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    return () => {
      // Destruir el gráfico al desmontar el componente
      myChart.destroy();
    };
  }, [chartData]);
  
  return (
    <canvas ref={chartRef} />
  );
};

export default BarChart;
