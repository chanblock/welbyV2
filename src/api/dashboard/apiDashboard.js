
import { BASE_URL } from '../apiConfig';


export const listUsers = async()=>{

    try {
        const response = await fetch(`${BASE_URL}/dashboard/users/list/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // await AsyncStorage.setItem('report', JSON.stringify(data['message']));
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
  
}


export const listReportByUser = async(userId) =>{
    try {
        const url = new URL(`${BASE_URL}/dashboard/report/by_user_id/`);
        url.searchParams.append('user_id', userId);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Aquí puedes agregar más headers si son necesarios, como tokens de autenticación
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in request:', error);
        throw error;
    }
}

export const listReport = async() => {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/report/list/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // await AsyncStorage.setItem('report', JSON.stringify(data['message']));
        return data;
    } catch (error) {
        console.error('Error in request:', error);
        throw error;
    }
}

export const aggregateCountsByMonth = (reportTypes) => {
    const currentYear = new Date().getFullYear();
    const countsByTypeAndMonth = {};

    reportTypes.forEach(({ type, dataPoints }) => {
        if (!countsByTypeAndMonth[type]) {
            countsByTypeAndMonth[type] = Array(12).fill(0); // Inicializa el array para cada tipo
        }

        dataPoints.forEach(({ date, count }) => {
            const dateObj = new Date(date);
            if (dateObj.getFullYear() === currentYear) {
                const month = dateObj.getMonth(); // Obtener el mes (0-11) de la fecha
                countsByTypeAndMonth[type][month] += count; // Agregar el conteo al mes correspondiente
            }
        });
    });

    return countsByTypeAndMonth;
};


