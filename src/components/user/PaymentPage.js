import React, { useState, useEffect,useContext } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Spinner, Alert,Button,Table} from "react-bootstrap";
// import { getUser,paymentSubscription,updateHadSuccessfulSubscription,UpdateFieldUser } from "../../api";
import {getSubscription,paymentSubscription,updateHadSuccessfulSubscription} from "../../api/payment";
import { getUser,UpdateFieldUser} from '../../api/user';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import "../../styles/PaymentPage.css";
import {useNavigate} from "react-router-dom";
import Select from 'react-select';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { handleGetSubscription } = useContext(SubscriptionContext);
  
  const [name, setName] = useState('');

  const [messages, setMessages] = useState('');
  
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState();
  const [clientSecret, setClientSecret]= useState('');
  const [subscriptionId, setSubscriptionId]= useState('');
  const [showCardElement, setShowCardElement] = useState(true);
  const [subscription_type, setSubscription_type] = useState(''); // free, month, year
  const [selectedPlan, setSelectedPlan] = useState({ value: 'free', label: 'Free for 60 days' });
  const planOptions = [
    { value: 'free', label: 'Free for 60 days' },
    { value: 'month', label: 'Basic Plan $24/month' },
    { value: 'year', label: 'Annual Plan $264/year' }
  ];

  //  const to alert
  const [submitting, setSubmitting] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  const validateSubscription = async() => {
    let subscription = localStorage.getItem("subscription")

    if (subscription === "true"){
      const subscription = await getSubscription(localStorage.getItem("subscription_id"));
      const response =  await getUser(localStorage.getItem("token"));
      setUser(response.user);
      
      if(subscription){
        if (subscription.status === "active"){
          showAlert("You already have a subscription, you cannot subscribe again", "danger");
          return false; 
        }
      }

    }
    return true; 
  };


  const resetCardElement = () => {
    setShowCardElement(false);
    // Se agrega un ligero retraso antes de volver a montar el componente
    setTimeout(() => setShowCardElement(true), 10);
};
  const showAlert = (message, type = "info") => {
    setAlertMessage(message);
    setAlertType(type); // Set the alert type
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const [user, setUser] = useState(null);
  const fetchUser =  async() => {
    try {
      const response =  await getUser(localStorage.getItem("token"));
      setUser(response.user);
    } catch (error) {
      console.error('There was an error obtaining user data: ', error);
    }
  };

 
  useEffect(() => {
    fetchUser();
   

  }, []); // el array vacío significa que este efecto se ejecutará una vez después del primer renderizado

    // initialize stripe and elements
    const stripe = useStripe();
    const elements = useElements();
  
 
  const handleSubmit = async(e) => {
    // Tu lógica aquí
    e.preventDefault();
    setSubmitting(true);
    fetchUser();
  
    
    // Primero realiza la validación de la suscripción
    const isSubscriptionValid = await validateSubscription();
    if (!isSubscriptionValid) {
        resetCardElement(); // Resetea el CardElement
        // Si la suscripción no es válida, detén la ejecución de la función
        setSubmitting(false);
        return; // Detiene la ejecución de la función aquí
    }

    if (user && user.subscription_type) {
      if (user.subscription_type === selectedPlan.value && selectedPlan.value === "free") {
          showAlert("You already have a free subscription, you cannot subscribe again", "danger");
          resetCardElement(); // Resetea el CardElement
          // Si la suscripción no es válida, detén la ejecución de la función
          setSubmitting(false);
          return;// Devuelve el tipo de suscripción
      }

      if (user.subscription_type === "month" && selectedPlan.value === "free") {
        showAlert("You already have a month subscription, you cannot subscribe free", "danger");
        resetCardElement(); // Resetea el CardElement
        // Si la suscripción no es válida, detén la ejecución de la función
        setSubmitting(false);
        return;// Devuelve el tipo de suscripción
    }
    }
    try {
    // if (updatedFieldUser){
        const data= await paymentSubscription(localStorage.getItem("token"),user.email,name,selectedPlan.value);

        if (data.subscription.clientSecret) {
          setClientSecret(data.subscription.clientSecret)
          setSubscriptionId(data.subscription.subscriptionId)
          const cardElement = elements.getElement(CardElement);
      
          // Use card Element to tokenize payment details
          let { error, paymentIntent } = await stripe.confirmCardPayment(data.subscription.clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: name,
              }
            }
          });

          if(error) {
            // show error and collect new card details.
            setMessages(error.message);
            console.log("Error in paymentSubscription")
            setSubmitting(false);
            // if payments is canceled find user and delete subscription in db and stripe(customer/subscription)
            
          }else{
            setSubmitting(false);
            setPaymentIntent(paymentIntent);
            if(paymentIntent && paymentIntent.status === 'succeeded') {
                setSubmitting(false);
                await UpdateFieldUser(localStorage.getItem("token"),"subscription_type",selectedPlan.value);
                await updateHadSuccessfulSubscription(localStorage.getItem("token"), true);
                await handleGetSubscription(subscriptionId);
                showAlert("Your payment has been successful, for more details check your subscription profile")
                setTimeout(() => {
                  navigate('/home');
              }, 3000);

              }

        }
        } else {
              // Si no hay clientSecret, significa que no se requiere un pago (suscripción gratuita)
              await UpdateFieldUser(localStorage.getItem("token"),"subscription_type",selectedPlan.value);
              await updateHadSuccessfulSubscription(localStorage.getItem("token"), true);
              await handleGetSubscription(subscriptionId);
                    
                    showAlert("Successful subscription!");
                    setName('');
                    
                    // Restablecer también el CardElement de Stripe si es necesario
                    // Restablecer CardElement
                    const cardElement = elements.getElement(CardElement);
                    cardElement.clear();
                    setTimeout(() => {
                      navigate('/home');
                  }, 3000);
                    
        }
        
   
    } catch (error) {
      console.error("error in payment");
      showAlert("Failed to send payment. Please try again later.", "danger");
      setSubmitting(false);
    }

  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="subscription-page">
     
      <div className="subscription-details-container">
        <br></br>
        <br></br>
        <br></br>
        <h2><strong>Hi,</strong> {user && user.username} select the ideal plan for you</h2>
        <br></br>
        <br></br>
        <div >
                <p >
                Experience a childcare revolution with our subscription service. Save 2-5 hours of work weekly, reduce stress, personalize your approach, automate repetitive tasks, and ensure compliance effortlessly. 
                
            <br/>
            <br/>
            <strong>&#10003; Child Care Expert:</strong> Unlimited access to the different types of reports and access to them at any time.
            <br/>
            <strong>&#10003; Ask me anything (Chat):</strong> Subscribers will have direct access to a real-time artificial intelligence chat channel.
       
            <br/>
            <strong>&#10003; Personalized advice:</strong> You will receive specialized and personalized advice, adapted to the daily challenges of child care..

            <br/>

          </p>
          
        </div>
        <br />
        <Table className="myTable">
    <tbody>
    <tr>
        <td colSpan={2}></td>
        <td colSpan={6}className="headerCell text-center">Plan</td>
        
      </tr>
      <tr>
        <td colSpan={2}></td>
        <td className="headerCell text-center">Free</td> 
        <td className="headerCell text-center">Basic</td>
        <td className="headerCell text-center">Premium</td>
      </tr>
      <tr>
        <td colSpan={2}>Price</td>
        <td className='text-center'>for 60 days, then $24/month</td>
        <td className='text-center'>$24 month</td>
        <td className='text-center'>$264 Annual</td>
      </tr>
      <tr>
        <td colSpan={2}>Child Care Expert</td>
        <td className='text-center'><strong>&#10003;</strong></td>
        <td className='text-center'><strong>&#10003;</strong></td>
        <td className='text-center'><strong>&#10003;</strong></td>
      </tr>
      <tr>
        <td colSpan={2}>Ask me anything (Chat)</td>
        <td className='text-center'><strong>&#10003;</strong></td>
        <td className='text-center'><strong>&#10003;</strong></td>
        <td className='text-center'><strong>&#10003;</strong></td> 
      </tr>
      <tr>
        <td colSpan={2}>Personalized advice</td>
        <td className='text-center'><strong>&#10007;</strong></td> 
        <td className='text-center'><strong>&#10007;</strong></td>
        <td className='text-center'><strong>&#10003;</strong></td>
      </tr>
    </tbody>
  </Table>

        <div>
              <Button onClick={handleGoBack} className="mt-2 d-none d-md-inline-block" variant="light">
                Go Back
              </Button>
        </div>

      <br></br>
      </div>
      <div className="payment-form-container">
        <h2>Card payment</h2>
        <br></br>
        {alertVisible && (
          <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
        <label>
            <small>Subscription Plan</small>
          </label>
          <Select 
            options={planOptions} 
            value={selectedPlan}
            onChange={setSelectedPlan} 
            
          />
    
        <br></br>
        
        <label>
        <small>Cardholder Name</small>
        </label>
        <input type="text" id="cardName" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        <br></br>
          <label>
          <small>Card information</small>
          </label>
          
          {/* <div className="stripe-card-element">
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
          </div> */}
          <div className="stripe-card-element">
            {showCardElement && (
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
            )}
        </div>
          
          <button className="subscribe-button" type="submit" disabled={submitting}>
         
          {submitting ? (
            <Spinner animation="border" size="sm" />
              ) : ("Subscribe")}
          </button>

          <div className="message-box" style={{ color: 'red', marginTop: '0px' }}>{messages}</div>
          <br></br>
        </form>
        <p className="disclaimer">
        If you confirm the subscription, you will allow this payment and future payments to be charged to your card in accordance with the stipulated conditions. Payments made on the web are made through Stripe.
        </p>
        <div className="footer-links">
          <a href="https://stripe.com/legal/end-users" target="_blank" rel="noopener">Conditions</a>
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Privacy</a>
        </div>
 
      </div>
    </div>
  );
};

export default PaymentPage;
