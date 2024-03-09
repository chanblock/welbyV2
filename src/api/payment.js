import { BASE_URL } from './apiConfig';


// funciones para request de stripe
export const checkSubscription = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/users/check_subscription/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token
            }),
        });

        const data = await response.json();

        // Verificar si el inicio de sesión es exitoso
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


export const createStripeCheckoutSession = async (email) => {
    try {

        const response = await fetch(`${BASE_URL}/users/create_checkout_session/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, priceId: 'price_1N2MoBC0hQJYRjaPqWGGHKMo' }),
        });

        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const paymentSubscription = async (token, email, name) => {
    try {
        const response = await fetch(`${BASE_URL}/users/payment-subscription/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, token }),
        });
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const updateHadSuccessfulSubscription = async (userId, hadSuccessfulSubscription) => {
    const response = await fetch(`${BASE_URL}/users/had-subscription/`, {
        method: 'POST', // or 'PUT', depending on how your API handles updates
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'token': userId,
            'had_successful_subscription': hadSuccessfulSubscription,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export const getSubscription = async (subscriptionId) => {
    try {

        const response = await fetch(`${BASE_URL}/users/get-subscription/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscriptionId
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

export const cancelSubscription = async (token, subscriptionId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/cancel-subscription/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                subscriptionId
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

export const updateCard = async (token, paymentMethodId, subscriptionId) => {
    try {

        console.log(token, paymentMethodId, subscriptionId)
        const response = await fetch(`${BASE_URL}/users/update-card/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                paymentMethodId,
                subscriptionId
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


export const sendDiscountEmail = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/users/send-discount-email/`, {
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