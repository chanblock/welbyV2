import React from 'react';
import ReportByUser from './ReportByUser';
import { useLocation } from 'react-router-dom';
import '../../../../styles/dashboard/css/sidebar.css';

// Importa otros componentes de gráfica si los necesitas

const GraphicsContainer = ({ isNavExpanded }) => {
    // Puedes agregar lógica aquí para decidir qué gráfica mostrar
    // Por ejemplo, basándote en `chartType` o en la estructura de `reportData`
    const location = useLocation();
    const reportes = location.state?.reportData;
    const chartType = location.state?.chartType;
    console.log(reportes)
    return (
        <div className={`height-100 bg-light ${isNavExpanded ? 'base-pd' : ''}`}>
            <div className="section">
                <div className="row row-cols-1 row-cols-xl-2">
                    <div className="col">
                        <h2>Reportes por usuario</h2><br></br>
                        {/* Componente para la gráfica de cantidad de reportes diarios vs tiempo */}
                        <div className='chart-card'>
                        {chartType === 'bar' && <ReportByUser reportData={reportes} />}
                        </div>
                    </div>
                    <div className="col ">
                        

                    </div>
                </div>
            </div> 
           
            {/* Aquí puedes añadir condiciones para otras gráficas */}
        </div>
    );
};

export default GraphicsContainer;
