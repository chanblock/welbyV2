import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import "../../styles/PaymentPage.css";
import { updateReferralDiscount, getUserDiscount, deleteUserByEmail, registerUser, paymentSubscription, updateHadSuccessfulSubscription } from '../../api';
import {
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { getListChildCare } from "../../api";


function RegisterBasic() {
    const location1 = useLocation();
    const { title, price } = location1.state;
    const { referralId } = useParams();
    const [username, setUsername] = useState('');
    const [nameCard, setNameCard] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [referral, setReferral] = useState(null);
    const [loading, setLoading] = useState(false);

    const [childcareWorker, setChildcareWorker] = useState(false);
    const [childcare, setChildcare] = useState(null);

    // const to payment stripe
    const stripe = useStripe();
    const elements = useElements();
    const [paymentIntent, setPaymentIntent] = useState();
    const [clientSecret, setClientSecret] = useState('');
    const [subscriptionId, setSubscriptionId] = useState('');


    const navigate = useNavigate();
    const location = useLocation();

    //  const to alert
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");

    const showAlert = (message, type = "info") => {
        setAlertMessage(message);
        setAlertType(type); // Set the alert type
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, 4000);
    };

    const loadOptions = async (inputValue) => {
        const getChildCare = await getListChildCare(inputValue)
        // Transforma los datos en el formato que react-select espera
        return getChildCare.map(childcare => ({ value: childcare.ServiceApprovalNumber, label: childcare.ServiceName }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);


        const checkbox = event.target.userType;
        const userType = checkbox.checked ? checkbox.value : "usergeneral";
        const referred_user = false;
        let subscription_type;
        if (title == "Basic") {
            subscription_type = "month";
        } else {
            subscription_type = "year";
        }

        try {
            // Create a new customer and subscription
            const idNewRegister = await registerUser(username, email, password, phone, userType, referred_user, subscription_type);
            const createSubcription = await paymentSubscription(idNewRegister['token'], email, nameCard);
            setClientSecret(createSubcription.subscription.clientSecret)
            setSubscriptionId(createSubcription.subscription.subscriptionId)
            const cardElement = elements.getElement(CardElement);
            // Use card Element to tokenize payment details
            let { error, paymentIntent } = await stripe.confirmCardPayment(createSubcription.subscription.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: nameCard,
                    }
                }
            });
            if (error) {
                // show error and collect new card details.
                setLoading(false);
                showAlert("error en cofirmCardPayments" + error.message, "danger")
                const response = await deleteUserByEmail(email);

                console.log("error in register card ")
                // if payments is canceled find user and delete subscription in db and stripe(customer/subscription)

            } else {
                setPaymentIntent(paymentIntent);
                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    await updateHadSuccessfulSubscription(idNewRegister['token'], true);
                    setLoading(false);
                    showAlert("Register successful!");
                    setTimeout(() => {
                        navigate('/auth');
                    }, 3000);
                } else {
                    console.log('Payment failed!', paymentIntent.status);
                    setLoading(false);
                    const response = await deleteUserByEmail(email);
                    showAlert("Register failed!", "danger");
                    navigate('/auth');
                }
            }

        } catch (error) {
            setLoading(false);
            showAlert(error.message, "danger");
            const response = await deleteUserByEmail(email);

            console.error('Failed to register user', error);
        }
    };

    return (
        <div className="subscription-page">
            <div className="subscription-details-container">
                <h2>Subscription Details</h2>
                <hr></hr>
                <div className="subscription-details">
                    <div><strong>Hi, </strong> </div>
                    <p >
                        Our paid subscription is a door to an enriching and personalized experience.
                        For only <strong>{title === "Premium" ? "$264" : "$24"}</strong>, you will have access to a wide range of exclusive benefits:
                        <br />
                        <br />
                        <strong>Child Care Expert:</strong> Unlimited access to the different types of reports and access to them at any time.
                        <br />
                        <strong>Ask me anything (Chat):</strong> Subscribers will have direct access to a real-time artificial intelligence chat channel.
                        
                        <br />
                        <strong>Personalized advice:</strong> Using our advanced artificial intelligence, you will receive specialized and personalized advice, tailored to the daily challenges of child care.
                        <br />
                        By subscribing, you are not only investing in a quality experience, but you are also supporting our work to continue to provide exceptional service. We look forward to welcoming you to our community of subscribers!

                    </p>
                    <div>
                        {title !== "Premium" && (
                            <p className="lead">
                                <strong>
                                    Get a <mark>50%</mark> discount on the subscription for your first time
                                </strong>
                            </p>
                        )}
                    </div>

                </div>



                <br></br>
            </div>
            <div className="payment-form-container2">

                <h2 className='text-center'>{title} plan</h2>
                {title !== "Premium" && (
                    <p className="lead alert alert-info">
                        Get 50%ss discount for being your first time.
                    </p>
                )}

                {alertVisible && (
                    <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <hr></hr>
                <form className="auth-form auth-form-MaxWith" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-6">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-12">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>


                    <div className="col-12">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>


                    <div className="row">
                        <div className="col-1">
                            <input
                                type="checkbox"
                                id="userType"
                                name="userType"
                                value="childcareWorker"
                                className="big-checkbox"
                                onChange={(e) => setChildcareWorker(e.target.checked)}
                            />
                        </div>
                        <div className="col-11">
                            <label htmlFor="userType" className="checkbox-label">Are you a Childcare Worker?</label>
                        </div>

                        {childcareWorker && (
                            <div className="col-12">
                                <label htmlFor="childcare">Select your Childcare:</label>
                                <AsyncSelect
                                    id="childcare"
                                    loadOptions={loadOptions}
                                    onChange={selectedOption => setChildcare(selectedOption)}
                                />
                            </div>
                        )}

                    </div>

                    <div className="col-12">

                        <p className="lead">
                            Card Information.
                        </p>


                        <input
                            type="text"
                            name="nameCard"
                            placeholder=" Cardholder Name "
                            value={nameCard}
                            onChange={(e) => setNameCard(e.target.value)}
                            required
                        />
                    </div>


                    <div className="col-12">
                        <div className="stripe-card-element">

                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            fontFamily: 'Arial, sans-serif',
                                        },
                                    },
                                    hidePostalCode: true, // Omitir el campo ZIP
                                }}
                            />
                        </div>
                        <p className="disclaimer">
                            If you confirm the subscription, you will allow this payment and future payments to be charged to your card in accordance with the stipulated conditions. Payments made on the web are made through Stripe.
                        </p>
                        <div className="footer-links">
                            <a href="https://stripe.com/legal/end-users" target="_blank" rel="noopener">Conditions</a>
                            <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Privacy</a>
                        </div>
                    </div>
                    <button className="button-shared  auth-submit" type="submit">
                        Sign up
                        {loading && (
                            <Spinner
                                animation="border"
                                size="sm"
                                style={{ marginLeft: '8px' }}
                            />
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default RegisterBasic;
