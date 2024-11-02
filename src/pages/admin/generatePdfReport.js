import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Chart } from 'chart.js';
import html2canvas from 'html2canvas';

export const generatePdfReport = async (project, tasks) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text(`Reporte de Proyecto: ${project.name}`, 10, 10);

  // Tabla de tareas
  doc.autoTable({
    startY: 20,
    head: [['Usuario', 'Tarea', 'Estado']],
    body: tasks.map(task => [
      task.assignedTo.map(user => user.name).join(', '),
      task.title,
      task.status,
    ]),
  });

  // Crear un canvas temporal para el gráfico
  const chartContainer = document.createElement('canvas');
  chartContainer.width = 400;
  chartContainer.height = 200;

  const chart = new Chart(chartContainer, {
    type: 'bar',
    data: {
      labels: ['Completadas', 'Pendientes'],
      datasets: [{
        label: 'Estado de tareas',
        data: [
          tasks.filter(task => task.status === 'completed').length,
          tasks.filter(task => task.status === 'pending').length,
        ],
        backgroundColor: ['#4CAF50', '#FFC107'],
      }],
    },
  });

  // Renderizar el canvas a imagen usando html2canvas
  const chartImage = await html2canvas(chartContainer);

  // Agregar el gráfico al PDF
  const chartImageData = chartImage.toDataURL('image/png');
  doc.addImage(chartImageData, 'PNG', 10, doc.lastAutoTable.finalY + 10, 180, 80);

  doc.save(`${project.name}-reporte.pdf`);
};
