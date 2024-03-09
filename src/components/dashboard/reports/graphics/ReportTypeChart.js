import React, { useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


am4core.useTheme(am4themes_animated);

const ReportTypeChart = ({ reportTypeData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (reportTypeData) {
            let chart = am4core.create(chartRef.current, am4charts.XYChart);
            chart.data = reportTypeData.dataPoints;

           

            // Crear ejes
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 50;
            dateAxis.dataFields.category = "date";

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            // Crear series
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "count";
            series.dataFields.dateX = "date";
            series.name = reportTypeData.type;
            series.tooltipText = "{name}: [bold]{valueY}[/]";

             // Ajustes adicionales para un tamaño más pequeño
            //  chart.legend.fontSize = 10; // Reducir el tamaño de la fuente de la leyenda
            //  chart.legend.position = "bottom"; // Posicionar la leyenda en la parte inferior
            //  chart.padding(10, 10, 10, 10); // Ajustar los márgenes internos del gráfico
            // chart.cursor = new am4charts.XYCursor();
            // chart.legend = new am4charts.Legend();
            // Crear y configurar la leyenda
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        chart.legend.fontSize = 10;
        chart.legend.position = "bottom";
        chart.cursor = new am4charts.XYCursor();
            // chart.legend = new am4charts.Legend();

        // Ajustes adicionales para un tamaño más pequeño
        chart.padding(10, 10, 10, 10);

            return () => {
                chart.dispose();
            };
        }
    }, [reportTypeData]);

    return (
        <div ref={chartRef} style={{ width: "450px", height: "350px" }}></div>
    );
};

export default ReportTypeChart;
