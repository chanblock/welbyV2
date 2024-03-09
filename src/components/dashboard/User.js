import React, { useEffect,useState } from 'react';
import '../../styles/dashboard/css/sidebar.css';
import '../../styles/dashboard/css/table.css';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useLocation } from 'react-router-dom';
import { listReportByUser } from '../../api/dashboard/apiDashboard';


const ChildMessageRenderer = (props) => {
    const navigate = useNavigate()
    const invokeParentMethod = async() => {
        let data_id = props.data._id
        const listReportByUser1 = await listReportByUser(data_id)
        // navigate('/report-user/list', { state: { listReportByUser1} });
        navigate('/reports_user', { state: { reportData: listReportByUser1, chartType: 'bar' } });
        
    };
  
    return (
      <span>
        <button
          style={{ height: 20, lineHeight: 0.5 }}
          onClick={invokeParentMethod}
          className="btn btn-info"
        >
          Detalle 
        </button>
      </span>
    );
  };

    
const User = ({ isNavExpanded }) => {
        const navigate = useNavigate()

    const location = useLocation();
    const userData = location.state?.users;
    const [gridApi, setGridApi] = useState(null);
    const [columnDefs] = useState([
        { headerName: "No", field: "index", filter: 'agNumberColumnFilter' },
        { headerName: "Nombre de Usuario", field: "username", filter: 'agTextColumnFilter' },
        { headerName: "Email", field: "email", filter: 'agTextColumnFilter' },
        { headerName: "Numero telefonico", field: "number_phone", filter: 'agTextColumnFilter' },
        {
            headerName: 'Detalle',
            field: 'value',
            cellRenderer: ChildMessageRenderer,
            colId: 'params',
            editable: false,
            minWidth: 150,
          },
        
        


        // ... otras definiciones de columnas ...
    ]);
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (userData) {
            const processedData = userData.map((user, index) => ({
                ...user,
                index: index + 1,
                // ... procesar otros campos si es necesario ...
            }));
            setRowData(processedData);
        }
    }, [userData]);

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const handleInfoClick = async(userId) => {
        // ... tu código existente ...
    };

    return (
        <div className={`height-100 bg-light ${isNavExpanded ? 'base-pd' : ''}`}>
            <h4>Lista de Usuarios</h4>
            <div className="ag-theme-alpine" style={{ height: 700, width: '70%' }}>
                <AgGridReact
                    onGridReady={onGridReady}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    frameworkComponents={{
                        SimpleCellRenderer: ChildMessageRenderer
                    }}
                    
                />
            </div>
        </div>
    );
};

export default User;