import React, { useEffect, useRef } from 'react';
// Importaciones de amCharts
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import '../../../../../styles/dashboard/css/dashboard.css';


am4core.useTheme(am4themes_animated);

const PieChartCountvsTypeReport = ({ data }) => {
    const chartRef = useRef(null);
    const { conteosPorTipo } = data; // Asegúrate de que esta línea no cause errores
    
    useEffect(() => {
        if (conteosPorTipo) {
            // Crear instancia del gráfico utilizando chartRef.current
            let chart = am4core.create(chartRef.current, am4charts.PieChart);
            chart.data = conteosPorTipo;

            // Configurar la serie del gráfico
            let pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "count";
            pieSeries.dataFields.category = "type";

            // Ajuste del radio del pastel
        pieSeries.innerRadius = am4core.percent(40); // Ajusta según sea necesario
        pieSeries.radius = am4core.percent(80); // Ajusta según sea necesario

        // Ajuste de las etiquetas
        pieSeries.labels.template.fontSize = 12; // Ajusta según sea necesario
        pieSeries.labels.template.truncate = true;
        pieSeries.labels.template.maxWidth = 100; // Ajusta según sea necesario


            return () => {
                chart.dispose();
            };
        }
    }, [conteosPorTipo]); // Dependencia: conteosPorTipo

    return (
        <div className="pie-chart-container">  
         
<div ref={chartRef} style={{ width: "110%", height: "450px" }}></div>
</div> 
    );
};

export default PieChartCountvsTypeReport;

