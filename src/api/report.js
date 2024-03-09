import { BASE_URL } from './apiConfig';



export const submitChat = async (message, messages) => {

    try {
        const response = await fetch(`${BASE_URL}/api/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                messages,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

}

export const submitDailyReport = async (token, rangeAgeDailyReport, date, activities) => {

    try {
        const response = await fetch(`${BASE_URL}/api/daily_report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                date,
                rangeAgeDailyReport,
                activities,
            }),

        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const submitCriticalReflection = async (token, date, description) => {
    try {
        const response = await fetch(`${BASE_URL}/api/critical_reflection/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                date,
                description

            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const submitGoal = async (token, date, name, age, goals) => {
    try {
        const response = await fetch(`${BASE_URL}/api/goal_report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                date,
                name,
                age,
                goals,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const submitObservations = async (token, date, name, age, goalObservations, descriptions) => {
    try {
        const response = await fetch(`${BASE_URL}/api/observations_report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                date,
                name,
                age,
                goalObservations,
                descriptions

            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const submitWeeklyReflection = async (token, date, description_reflection) => {
    try {
        const response = await fetch(`${BASE_URL}/api/weekly_reflection/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                date,
                description_reflection
            }),

        });

        const data = await response.json();
        console.log("data: ", data)
        return data;
    } catch (error) {
        console.error('Error in submitWeeklyReflection');
        throw error;
    }
}

export const submitWeeklyPlanning = async (token, date, range_age, goals) => {
    try {
        const response = await fetch(`${BASE_URL}/api/weekly_planning/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                date,
                range_age,
                goals
            }),

        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const submitSummativeAssessment = async (token, date, name, age, outComes) => {
    try {
        const response = await fetch(`${BASE_URL}/api/summative-assessment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                date,
                name,
                age,
                outComes
            }),

        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


// request to historical reports
export const submitSaveReport = async (
    token,
    typeReport,
    report,
    childName = null,
    childId = null,
    age = null,
    goalObservations = null,
    rangeAge = null,
    rangeAgeDailyReport = null,
    goalFollowUp = null,
) => {
    let body;
    switch (typeReport) {
        case 'Daily Report':
            body = { token, typeReport, report, rangeAgeDailyReport };
            break;
        case 'Weekly Planning':
            body = { token, typeReport, report, rangeAge };
            break;
        case 'Goal Report':
            body = { token, typeReport, report, childName, childId, age };
            break;
        case 'Follow up':
            body = { token, typeReport, report, childName, childId, age, goalFollowUp };
            break;
        case 'Descriptions Report':
            body = { token, typeReport, report, childName, childId, age, goalObservations };
            break;
        default:
            body = { token, typeReport, report };
            break;
    }


    try {
        const response = await fetch(`${BASE_URL}/api/save_report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(body),

        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateReport = async (data) => {
    try {
        console.log("updata report")
        const response = await fetch(`${BASE_URL}/api/update_report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data

            }),

        });

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }


}
export const submitHistoricalReport = async (token, typeReport) => {

    try {
        const response = await fetch(`${BASE_URL}/api/historical_report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                typeReport,

            }),

        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const submitGetHistoricalReport = async (token) => {
    try {

        const response = await fetch(`${BASE_URL}/api/get_historical_report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token
            }),

        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const submitGetVariablesReports = async (token, typeReport) => {
    try {
        const response = await fetch(`${BASE_URL}/api/get_variables_reports/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                typeReport
            }),

        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const submitWeeklyReflectionByDays = async (token, description) => {

    try {

        const response = await fetch(`${BASE_URL}/api/days_to_weekly_reflection/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                description
            }),

        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const submitFollowUp = async (token, date, name, age, goalFollowUp, descriptionsFollowUp) => {
    try {
        const response = await fetch(`${BASE_URL}/api/follow_up/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                date,
                name,
                age,
                goalFollowUp,
                descriptionsFollowUp

            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const deleteReport = async (reportId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/delete-report/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reportId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const fetchLastDocumentData = async (token, typeReport) => {
    try {
        const response = await fetch(`${BASE_URL}/api/get_last_variable/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                typeReport
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting last document:", error);
    }
};

export const submitCreateWord = async (token, selectedReports) => {
    try {
        const response = await fetch(`${BASE_URL}/api/create-word/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, selectedReports }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}