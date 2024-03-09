
import { BASE_URL } from './apiConfig';

// request to log in and sign up
export const registerUser = async (username, email, password, phone, userType, referred_user, subscription_type, childcareList) => {
    try {

        const response = await fetch(`${BASE_URL}/users/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                phone,
                userType,
                referred_user,
                subscription_type,
                childcareList
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            // Lanza un error si el inicio de sesión no es exitoso
            const error = new Error(data.error);
            error.response = response;
            throw error;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getUser = async (token) => {
    try {

        const response = await fetch(`${BASE_URL}/users/get-user/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token
            }),
        });
        const data = await response.json();

        if (response.ok) {
            return data;

        } else {
            // Lanza un error si el inicio de sesión no es exitoso
            const error = new Error(data.error);
            error.response = response;
            throw error;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const UpdateFieldUser = async (token, field_user, value) => {
    try {
        const response = await fetch(`${BASE_URL}/users/update_field_user/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
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


export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/users/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });


        const data = await response.json();
        // Verificar si el inicio de sesión es exitoso
        if (response.ok) {

            return data.data_user;
        } else {
            // Lanza un error si el inicio de sesión no es exitoso
            const error = new Error(data.error);
            error.response = response;
            throw error;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteUserByEmail = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/users/delete-user-by-email/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
            }),
        });

        const data = await response.json();
        // Verificar response
        if (response.ok) {
            return data;
        } else {
            // Lanza un error si el inicio de sesión no es exitoso
            const error = new Error(data.error);
            error.response = response;
            throw error;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateReferralDiscount = async (token, discount) => {
    const response = await fetch(`${BASE_URL}/users/update-referral-discount/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, discount }),
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
};

export const getListChildCare = async (inputValue) => {
    const response = await fetch(`${BASE_URL}/users/get-childcare/?search=${inputValue}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
}

export const updateUser = async (token, username, email, numberPhone, childcareList) => {
    try {
        const response = await fetch(`${BASE_URL}/users/update-user/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                username,
                email,
                numberPhone,
                childcareList
            }),
        });

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            // Lanza un error si la actualización no es exitosa
            const error = new Error(data.error);
            error.response = response;
            throw error;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const requestPasswordReset = async (email) => {
    const response = await fetch(`${BASE_URL}/users/request-password-reset/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
};

export const resetPassword = async (token, newPassword) => {
    const response = await fetch(`${BASE_URL}/users/reset-password/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password: newPassword }),
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
};

export const registerReferral = async (token, referralCode) => {
    try {
        const response = await fetch(`${BASE_URL}/users/register-referral/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, referralCode }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export const submitGetReferralLink = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/users/get-referral-link/`, {
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