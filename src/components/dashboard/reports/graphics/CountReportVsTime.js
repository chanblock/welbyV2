// ReportChart.js

import React, { useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const CountReportVsTime = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Crear instancia de gráfico
        let chart = am4core.create(chartRef.current, am4charts.XYChart);
        // Agregar datos
        chart.data = data.fechas.map((fecha, index) => ({
            date: fecha,
            value: data.conteos[index]
        }));
        // Crear ejes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.minZoomCount = 5;
        
        
        // this makes the data to be grouped
        dateAxis.groupData = true;
        dateAxis.groupCount = 500;


        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Crear serie
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;
        series.minBulletDistance = 10;
        series.tooltipText = "{valueY}";
        series.tooltip.pointerOrientation = "vertical";

        // Scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        

        // Cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;

        // Limpieza
        return () => {
            chart.dispose();
        };
    }, [data]);

    return (
        <div id="chartdiv" style={{ width: "100%", height: "450px" }} ref={chartRef}></div>
    );
};

export default CountReportVsTime;
