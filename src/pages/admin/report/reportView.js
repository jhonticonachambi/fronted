import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import pdfMake from 'pdfmake/build/pdfmake';
import API_URL from '../../../config/apiConfig'; // Importa la configuración de la API

// Registro de componentes de Chart.js
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChartComponent = ({ data, labels }) => {
  const chartRef = React.useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Tareas Completadas',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Reporte de Tareas Completadas',
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      barChart.destroy();
    };
  }, [data, labels]);

  return (
    <div style={{ width: '600px', height: '400px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

const ReportView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);

  const fetchProjectAndTasks = async () => {
    try {
      const projectResponse = await axios.get(`${API_URL}/projects/${id}`); // Usa API_URL en la solicitud
      setProject(projectResponse.data);

      const tasksResponse = await axios.get(`${API_URL}/tasks/project/${id}`); // Usa API_URL en la solicitud
      setTasks(tasksResponse.data);

      const userIds = [...new Set(tasksResponse.data.flatMap(task => task.assignedTo))];
      const userPromises = userIds.map(userId => fetchUserProfile(userId));
      const userResponses = await Promise.all(userPromises);
      const userMapping = userResponses.reduce((acc, user) => {
        acc[user._id] = user.name;
        return acc;
      }, {});
      setUserNames(userMapping);

      const completedTasks = tasksResponse.data.filter(task => task.status === 'completed');
      setChartData(completedTasks.map(() => 1));
      setChartLabels(completedTasks.map(task => userMapping[task.assignedTo[0]] || 'Sin asignar'));
    } catch (error) {
      console.error('Error fetching project and tasks:', error);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/${userId}`, { // Usa API_URL en la solicitud
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const generatePdfReport = () => {
    const docDefinition = {
      content: [
        { text: project ? project.name : 'Proyecto', style: 'header' },
        { text: project ? project.description : 'Descripción del proyecto', style: 'subheader' },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*'],
            body: [
              ['Usuario', 'Tarea', 'Estado'],
              ...tasks.map(task => [
                userNames[task.assignedTo[0]] || 'Sin asignar',
                task.title,
                task.status,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('reporte.pdf');
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  return (
    <Container>
      {project && (
        <>
          <Typography variant="h4">{project.name}</Typography>
          <Typography variant="body1">{project.description}</Typography>
          <Button variant="contained" color="primary" className="mt-4" onClick={generatePdfReport}>
            Generar Reporte
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Tarea</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.assignedTo.length > 0 ? userNames[task.assignedTo[0]] || 'Sin asignar' : 'Sin asignar'}</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <BarChartComponent data={chartData} labels={chartLabels} />
        </>
      )}
    </Container>
  );
};

export default ReportView;
