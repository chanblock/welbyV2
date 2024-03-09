import React, { useEffect,useState } from 'react';
import { listUsers } from '../../../../../api/dashboard/apiDashboard';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const ReportUserTable = ({ data }) => {
    const [usuarios, setUsuarios] = useState({});
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        { headerName: "Usuario", field: "user_id", sortable: true, filter: 'agTextColumnFilter' },
        { headerName: "Nombre de Usuario", field: "username", sortable: true, filter: 'agTextColumnFilter' },
        { headerName: "Cantidad de Reportes", field: "cantidad", sortable: true, filter: 'agTextColumnFilter' }
    ]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await listUsers();
                const usersMap = usersData.reduce((map, user) => {
                    map[user._id] = user.username;
                    return map;
                }, {});
                setUsuarios(usersMap);

                // Ordenar por cantidad de reportes y agregar numeración
                const sortedData = [...data].sort((a, b) => b.cantidad - a.cantidad);
                // Procesar los datos para AG-Grid
                const processedData = sortedData.map((item, index) => ({
                    ...item,
                    user_id: index + 1, // Numeración basada en el orden
                    username: usersMap[item.user_id] || 'Desconocido'
                }));
                setRowData(processedData);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsers();
    }, [data]);

    return (
        <div className="ag-theme-alpine" style={{ height: 450, width: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                quickFilter={true}
            />
        </div>
    );
};

export default ReportUserTable;
