import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
export const ReportContext = createContext();

// Crear el proveedor personalizado
export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);

    return (
        <ReportContext.Provider value={{ reports, setReports }}>
            {children}
        </ReportContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useReports = () => {
    
    return useContext(ReportContext);
};
