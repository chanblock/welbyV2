import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = ({ dataPoints, barColor }) => {
    const currentYear = new Date().getFullYear();
    const monthlyCounts = Array(12).fill(0); // Array para los 12 meses del año
    dataPoints.forEach(point => {
        const date = new Date(point.date);

        if (date.getFullYear() === currentYear) {
            monthlyCounts[date.getMonth()] += point.count;
        }
    });

    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Cantidad de Reportes',
                data: monthlyCounts,
                backgroundColor: barColor, // Usa el color pasado como prop
                borderColor: barColor,
                borderWidth: 1,
            }
        ],
    };

    return <Bar data={data} />;
};

export default BarChartComponent;
