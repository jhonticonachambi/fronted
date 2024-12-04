

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import API_URL from '../../config/apiConfig';

// Registrar los componentes que se usarán
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProjectTasksChart = ({ projectId }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ label: '', data: [] }]
  });

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`);
        const {tasks} = response.data;

        if (tasks && tasks.length > 0) {
          const taskStatuses = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
          }, {});

          setChartData({
            labels: Object.keys(taskStatuses),
            datasets: [
              {
                label: 'Task Statuses',
                data: Object.values(taskStatuses),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              },
            ],
          });
        } else {
          setChartData({
            labels: [],
            datasets: [{ label: 'Estados de Tareas', data: [] }]
          });
        }
      } catch (error) {
        console.error('Error fetching project and tasks:', error);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

  return (
    <div>
      <h6>Estado de Tareas</h6>
      <Bar data={chartData} />
    </div>
  );
};

export default ProjectTasksChart;
