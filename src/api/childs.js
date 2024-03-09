import { BASE_URL } from './apiConfig';

export const addNewChild = async (token, childName, childAge, childCare, birthDate) => {
    try {
        const response = await fetch(`${BASE_URL}/childs/add-child/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, childName, childAge, childCare, birthDate }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getListChilds = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/childs/get-childs/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const updateChild = async (childId, childName, childAge, childCare, tokenChildWorker, birthDate) => {
    try {
        const response = await fetch(`${BASE_URL}/childs/update-child/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ childId, childName, childAge, childCare, tokenChildWorker, birthDate }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const deleteChild = async (childId) => {
    try {
        const response = await fetch(`${BASE_URL}/childs/delete-child/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ childId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const UpdateAllChildren = async (childWorker_id, field_user, value) => {
    try {
        const response = await fetch(`${BASE_URL}/childs/update_all_children/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                childWorker_id,
                field_user,
                value
            }),
        });

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            // Lanza un error 
            const error = new Error(data.error);
            error.response = response;
            throw error;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;

    }
}
