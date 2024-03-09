import React,{useState,useEffect} from 'react';
import '../../styles/dashboard/css/dashboard.css';
import { useLocation } from 'react-router-dom';
import {processReportData,processDailyReportByType,sumarReportesPorUsuario} from '../../api/dashboard/processReportData';
import PieChartCountvsTypeReport from './reports/graphics/pieChart/PieChartCountvsTypeReport';
import CountReportVsTime from './reports/graphics/CountReportVsTime';
import MultipleGraphs from './reports/graphics/MultipleGraphs';
import ReportUserTable from './reports/graphics/table/ReportUserTable';
import BarChartComponent from './reports/graphics/barChart/BarChartComponent';
import { listReport,aggregateCountsByMonth } from '../../api/dashboard/apiDashboard';

const Dashboard = ({ isNavExpanded }) => {
    const location = useLocation();
    const [reportData, setReportData] = useState({ fechas: [], conteos: [] });
    const [dailyReportByTypeData, setDailyReportByTypeData] = useState([]);
    const [dataReportTable, setDataReportTable] = useState([]);
    const [dataCountsByMonthReports, setDataCountsByMonthReports] = useState([])
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'grey']; // Define tus colores
    const [conteosPorTipoRep, setConteosPorTipoRep] = useState([])
    useEffect(() => {
        // Función asíncrona anónima para manejar la carga de los reportes
        const fetchReports = async () => {
            try {
                // Llama a la función listReport
                const reportes = await listReport();
                // Procesa los datos de los reportes
                const processedData = processReportData(reportes);
                 // Procesa los datos para el gráfico por tipo reporte
                const dailyTypeData = processDailyReportByType(reportes);
                const dataTableReportUser = sumarReportesPorUsuario(reportes);
                const dataCountsByMonth = aggregateCountsByMonth(dailyTypeData);
                // Transformar el objeto en un arreglo de objetos
                const dataCountsByMonthArray = Object.keys(dataCountsByMonth).map(type => {
                    return {
                        type,
                        dataPoints: dataCountsByMonth[type].map((count, index) => {
                            return {
                                // Crear un objeto con la estructura { date, count }
                                // La fecha se crea basándose en el índice (mes) y el año actual
                                date: new Date(new Date().getFullYear(), index, 1).toISOString(),
                                count: count
                            };
                        })
                    };
                });
                // Actualiza e  l estado con los datos procesados
                setReportData(processedData);
                const {conteosPorTipo} = processedData
                setConteosPorTipoRep(conteosPorTipo)
                setDailyReportByTypeData(dailyTypeData);
                setDataReportTable(dataTableReportUser);
                setDataCountsByMonthReports(dataCountsByMonthArray)
            } catch (error) {
                // Manejo de errores
                console.error("Error al cargar los reportes:", error);
            }
        };
    
        // Ejecuta la función asíncrona
        fetchReports();
    
        // Dependencias del useEffect
    }, []);
    return (
        <div className={`height-100 bg-light`}>
          
            <div className='section'> 
            <h2><br /> Cantidad de reportes por tipo</h2><br></br>
            <div className="card-countTotal-container">
                {conteosPorTipoRep.map((data, index) => (
                    <div key={index} className={`card-counTotal ${index >= 4 ? 'card-counTotal2' : ''}`}>
                        {data.type.replace(/_/g, ' ')}:<br></br> {data.count}
                    </div>
                ))}
            </div>
            </div>
           <div className="section">
                <div className="row row-cols-1 row-cols-xl-2">
                    <div className="col">
                        <h2>Cantidad de reportes por dia</h2><br></br>
                        {/* Componente para la gráfica de cantidad de reportes diarios vs tiempo */}
                        <div className='chart-card'>
                        <CountReportVsTime data={reportData} />
                        </div>
                    </div>
                    <div className="col ">
                        <h2 >Cantidad de reportes por tipo</h2><br></br>
                        {/* Componente para el diagrama de torta */}
                        <div className='chart-card'>
                        
                        <PieChartCountvsTypeReport data={reportData}></PieChartCountvsTypeReport>
                        </div>

                    </div>
                </div>
            </div> 
            <div className="section">
                        <h2>Tipo de reportes</h2><br/>
                        {/* Componente para la gráfica de cantidad de reportes diarios vs tiempo */}
                        <div className="row">
                        {/* {dailyReportByTypeData.map((data, index) => (
                            <div key={index} className="col-12 col-md-6 col-lg-4">
                                <div className='chart-card-small'>
                                    <MultipleGraphs data={[data]} />
                                </div>
                            </div>
                        ))} */}
                    {dataCountsByMonthReports.map(({ type, dataPoints }, index) => (
                        
                        <div key={index} className="col-12 col-md-6 col-lg-4">
                            <div className='chart-card-small'>
                                <BarChartComponent
                                 dataPoints={dataPoints}
                                 barColor={colors[index % colors.length]} />
                                <div className="chart-label" style={{ textAlign: 'center' }}>
                                    <h5>{type}</h5>
                                </div>

                            </div>
                        </div>
                    ))}
                                        </div>

            </div>

            <div className="section">
               
            <div className="row row-cols-1 row-cols-xl-2">
                    <div className="col">
                        <h2>Tabla de usuarios</h2>
                                {/* Componente para la gráfica de cantidad de reportes diarios vs tiempo */}
                                <div className='chart-card'>
                                <ReportUserTable data={dataReportTable} />
                                </div>
                    </div>
                    <div className="col ">
                            

                           
                    </div>  
                    
               
                </div>
           
           
      
   </div>
        </div>
    );
};

export default Dashboard;
