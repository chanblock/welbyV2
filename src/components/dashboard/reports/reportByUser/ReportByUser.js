import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportByUser = ({ isNavExpanded }) => {
    const location = useLocation();
    const reportes = location.state?.reportData;

    // Procesar los datos para la gráfica
    const data = {
        labels: [],
        datasets: [
            {
                label: 'Cantidad de Reportes',
                data: [],
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
            }
        ],
    };

    const reportCounts = {};

    reportes?.forEach(report => {
        reportCounts[report.type_report] = (reportCounts[report.type_report] || 0) + 1;
    });

    data.labels = Object.keys(reportCounts);
    data.datasets[0].data = Object.values(reportCounts);

    return (
       
            <><h4>Reportes por Usuario</h4><Bar data={data} /></>
        
    );
};

export default ReportByUser