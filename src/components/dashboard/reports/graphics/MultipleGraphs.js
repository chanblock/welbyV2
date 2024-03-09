import React from 'react';
import ReportTypeChart from './ReportTypeChart';
import '../../../../styles/dashboard/css/sidebar.css';

const MultipleGraphs = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No hay datos disponibles.</div>;
    }

    return (
        <div >
            {data.map((reportTypeData, index) => (
                <div key={index} >
                    <ReportTypeChart reportTypeData={reportTypeData} />
                </div>
            ))}
        </div>
    );
};


export default MultipleGraphs;
