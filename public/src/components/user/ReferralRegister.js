import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation,useParams } from 'react-router-dom';
import {  Spinner,Alert } from 'react-bootstrap';
import "../../styles/PaymentPage.css";
import AsyncSelect from 'react-select/async';
import { updateReferralDiscount,getUserDiscount,deleteUserByEmail, registerUser,paymentSubscription,
    updateHadSuccessfulSubscription,getListChildCare } from '../../api';
import {
    CardElement,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js';
function ReferralRegister() {
    const { referralId } = useParams();
    const [username, setUsername] = useState('');
    const [nameCard, setNameCard] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [referral, setReferral] = useState(null);
    const [loading, setLoading] = useState(false);

    // const to payment stripe
    const stripe = useStripe();
    const elements = useElements();
    const [paymentIntent, setPaymentIntent] = useState();
    const [clientSecret, setClientSecret]= useState('');
    const [subscriptionId, setSubscriptionId]= useState('');

    // const to select childcare
    const [childcareWorker, setChildcareWorker] = useState(false);
    const [childcare, setChildcare] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

      //  const to alert
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    
    const loadOptions = async (inputValue) => {
        const getChildCare = await getListChildCare(inputValue)
        // Transforma los datos en el formato que react-select espera
        return getChildCare.map(childcare => ({ value: childcare.ServiceApprovalNumber, label: childcare.ServiceName }));
      };
     
    const showAlert = (message, type = "info") => {
        setAlertMessage(message);
        setAlertType(type); // Set the alert type
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
        }, 4000);
      };

    // Obtener la referencia desde la URL
    useEffect(() => {
        const referralFromURL = location.pathname.split('/').pop();
        setReferral(referralFromURL);
       
    }, [location]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);


        const checkbox = event.target.userType;
        const userType = checkbox.checked ? checkbox.value : "usergeneral";
        const old_user_token = referral;
        const referred_user = false;
        const subscription_type = "free";
        let childcareList = []; // Valor predeterminado vacío
        if (childcare !== null) {
            childcareList = [childcare];
        }
        
        try {
            // Create a new customer and subscription
            const idNewRegister = await registerUser(username, email, password, phone,userType,referred_user,subscription_type,childcareList);
            const createSubcription= await paymentSubscription(idNewRegister['token'],email,nameCard);
            if (createSubcription.subscription.clientSecret) {
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
                if(error) {
                    // show error and collect new card details.
                    setLoading(false);
                    showAlert("error en cofirmCardPayments"+ error.message, "danger")
                    const response = await deleteUserByEmail(email);
    
                    console.log("error in register card ")
                    // if payments is canceled find user and delete subscription in db and stripe(customer/subscription)
    
                }else{
                    setPaymentIntent(paymentIntent);
                    if(paymentIntent && paymentIntent.status === 'succeeded') {
                        await updateHadSuccessfulSubscription(idNewRegister['token'], true);
                        await updateReferralDiscount(old_user_token);
                        setLoading(false);
                        showAlert("Your registration and payment has been successful. You got a 100% discount for two months then $20!");
                        setTimeout(() => {
                            navigate('/auth');
                        }, 3000);
                    }else{
                        console.log('Payment failed!',paymentIntent.status);
                        setLoading(false);
                        const response = await deleteUserByEmail(email);
                        showAlert("Register failed!", "danger");
                        navigate('/auth');
                    }
                }
            } else {
                await updateHadSuccessfulSubscription(idNewRegister['token'], true);
                        await updateReferralDiscount(old_user_token);
                        setLoading(false);
                        showAlert("Your registration and payment has been successful. You got a 100% discount for two months then $20!");
                        setTimeout(() => {
                            navigate('/auth');
                        }, 3000);
            }
            

        } catch (error) {
            setLoading(false);
            showAlert(error.message, "danger");
            console.error('Failed to register user',error);  
             // Verifica si el mensaje de error NO es "Email already exists"
            if (error.message !== "Email already exists") {
                showAlert(error.message, "danger");
                const response = await deleteUserByEmail(email);
                // Aquí puedes manejar la respuesta de 'deleteUserByEmail' si es necesario
            } 
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
                For only <strong>$24</strong>, you will have access to a wide range of exclusive benefits:
                <br/>
                <br/>
                <strong>Child Care Expert:</strong> Unlimited access to the different types of reports and access to them at any time.
                <br/>
                <strong>Ask me anything (Chat):</strong> Subscribers will have direct access to a real-time artificial intelligence chat channel.
                <br/> 
                <strong>How to do in Australia:</strong> This feature will remain accessible even without a subscription.
                <br/>
                <br/>
                By subscribing, you are not only investing in a quality experience, but you are also supporting our work to continue to provide exceptional service. We look forward to welcoming you to our community of subscribers!

          </p>
          <div><p className="lead"><strong>Get a <mark>100%</mark> discount on the subscription then $24</strong></p></div>
          
        </div>

      

      <br></br>
      </div>
            <div className="payment-form-container2">
                
                <h2>Sign up</h2>
                <p className="lead alert alert-info" >
                    Get 100% discount for 2 months then $24.
                </p>
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

export default ReferralRegister;
