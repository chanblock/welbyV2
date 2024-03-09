

export const processReportData = (reportes) => {
    const conteoPorDia = {};
    const conteoPorTipo = {};
    
    reportes.forEach(reporte => {
        // Convertir a formato 'YYYY-MM-DD' para facilitar la ordenación
        const fecha = new Date(reporte.timestamp);
        const fechaOrdenable = fecha.toISOString().split('T')[0];

        conteoPorDia[fechaOrdenable] = (conteoPorDia[fechaOrdenable] || 0) + 1;
         // Procesar conteo por tipo de reporte
         const tipo = reporte.type_report;
         conteoPorTipo[tipo] = (conteoPorTipo[tipo] || 0) + 1;
    });

    // Ordenar las fechas
    const fechasOrdenadas = Object.keys(conteoPorDia).sort((a, b) => new Date(a) - new Date(b));
    const conteos = fechasOrdenadas.map(fecha => conteoPorDia[fecha]);
    // Preparar datos para gráfica por tipo
    const conteosPorTipo = Object.keys(conteoPorTipo).map(tipo => ({
        type: tipo,
        count: conteoPorTipo[tipo]
    }));

    return { fechas: fechasOrdenadas, conteos,conteosPorTipo  };
};

export const processDailyReportByType = (reportes) => {
    const conteoDiarioPorTipo = {};

    reportes.forEach(({ timestamp, type_report }) => {
        const fecha = new Date(timestamp).toISOString().split('T')[0];
        if (!conteoDiarioPorTipo[type_report]) {
            conteoDiarioPorTipo[type_report] = {};
        }
        conteoDiarioPorTipo[type_report][fecha] = (conteoDiarioPorTipo[type_report][fecha] || 0) + 1;
    });

    // Transformar para amCharts
    const seriesData = Object.keys(conteoDiarioPorTipo).map(tipo => {
        // Ordenar las fechas en orden cronológico
        const fechasOrdenadas = Object.keys(conteoDiarioPorTipo[tipo]).sort((a, b) => new Date(a) - new Date(b));
        const dataPoints = fechasOrdenadas.map(fecha => ({
            date: fecha,
            count: conteoDiarioPorTipo[tipo][fecha]
        }));
        return { type: tipo, dataPoints };
    });

    return seriesData;
};

export const sumarReportesPorUsuario = (reportes) => {
    const conteoPorUsuario = {};

    reportes.forEach(({ user_id }) => {
        conteoPorUsuario[user_id] = (conteoPorUsuario[user_id] || 0) + 1;
    });

    return Object.entries(conteoPorUsuario).map(([user_id, cantidad]) => ({
        user_id,
        cantidad
    }));
};


