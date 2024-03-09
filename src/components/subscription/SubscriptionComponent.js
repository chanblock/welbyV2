import React, { useState } from 'react';
import { Spinner,Alert } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';
import '../../styles/subscription/subscription.css' 
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import AsyncSelect from 'react-select/async';
import { registerUser, loginUser,getListChildCare,paymentSubscription, updateHadSuccessfulSubscription } from '../../api';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
const SubscriptionComponent = () => {
  const navigate = useNavigate();
  const location1 = useLocation();
   const { title, price } = location1.state;
  const [step, setStep] = useState(1);
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [childcare, setChildcare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataToken, setDataToken] = useState(null);
  //  const to alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  
    // const to payment stripe
    const stripe = useStripe();
    const elements = useElements();
    const [paymentIntent, setPaymentIntent] = useState();
    const [clientSecret, setClientSecret] = useState('');
    const [subscriptionId, setSubscriptionId] = useState('');
    
    const handleSignIn = ()=>{
      navigate("/auth");
    }
  const handleNextStep = async() => {
    // Si la validación es exitosa, avanzamos al siguiente paso
    if (step === 1) {
      //registar usuario o loguearse
      if (isRegistered){
        if (!validateFormLogin()) return;
        try {

              const data = await loginUser(email,password)
              setLoading(true);
              console.log(data)
              // Aquí puedes manejar la respuesta de la API después del registro
              if (data.error) {
                setLoading(false);
                console.log("error login")
                showAlert("Error login user", "danger");
              } else {
                // Guarda el token en el almacenamiento local
                // localStorage.setItem('token', data.token);
                setLoading(false);
                showAlert('Sign in successful');
                setDataToken(data.token);
                setPassword('');
                setEmail('');
                  // resetear el valor seleccionado en el select
                setChildcare({value: '', label: ''});
                setStep(2)
              }
          
        } catch (error) {
          console.error('Failed to register:', error);
          setLoading(false);
          showAlert(error.message, "danger");

        }
      }else{
        if (!validateForm()) return;

        const userType = 'childcareWorker';
        const referred_user = false;
        let subscription_type;
        switch(title) {
          case 'Premium':
              subscription_type = "year";
              break;
          case 'Basic':
              subscription_type = "month";
              break;
          case 'Free trial':
              subscription_type = "free";
              break;
          default:
              // Manejar caso por defecto si es necesario
              subscription_type = "month";
              break;
      }
        let childcareList = []; // Valor predeterminado vacío
        if (childcare !== null) {
            childcareList = [childcare];
        }

        try {
          const data = await registerUser(username, email, password, phone, userType, referred_user, subscription_type,childcareList);
          setLoading(true);
          // Aquí puedes manejar la respuesta de la API después del registro
          if (data.error) {
            setLoading(false);
            console.log("error in data register user")
            showAlert("Error in create user", "danger");
  
          } else {
            setLoading(false);
            showAlert('Sign up successful');
             // resetear el valor seleccionado en el select
            setChildcare({value: '', label: ''});
            setPassword('');
            setDataToken(data);
            setStep(2)
          }
          
        } catch (error) {
          console.error('Failed to register:', error);
          setLoading(false);
          // showAlert(error.message, "danger");m
  
        }
      }
    }else if (step === 2){
          //registar usuario
          if (!validateFormCard()) return;

          try {

            console.log("subscriptionComponente: ", email)
            // Create a new subscription
          setLoading(true);
            const createSubcription = await paymentSubscription(dataToken['token'], email,name );
            // Solo intenta confirmar el pago si hay un clientSecret
          if (createSubcription.subscription.clientSecret) {
              setClientSecret(createSubcription.subscription.clientSecret)
              setSubscriptionId(createSubcription.subscription.subscriptionId)
              const cardElement = elements.getElement(CardElement);
              // Use card Element to tokenize payment details
              let { error, paymentIntent } = await stripe.confirmCardPayment(createSubcription.subscription.clientSecret, {
                  payment_method: {
                      card: cardElement,
                      billing_details: {
                          name: name,
                      }
                  }
              });
              if (error) {
                // show error and collect new card details.
                setLoading(false);
                showAlert("error en cofirmCardPayments" + error.message, "danger")
                 // Restablecer CardElement
                 const cardElement = elements.getElement(CardElement);
                 cardElement.clear();
                console.log("error in register card ")
                // if payments is canceled find user and delete subscription in db and stripe(customer/subscription)

            } else {
                setPaymentIntent(paymentIntent);
                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    await updateHadSuccessfulSubscription(dataToken['token'], true);
                    setLoading(false);
                    showAlert("Successful subscription! you can now log in");
                    // Resetear los campos de entrada
                    setName('');
                    // Restablecer CardElement
                    const cardElement = elements.getElement(CardElement);
                    cardElement.clear();
                    setTimeout(() => {
                      navigate("/auth");
                    }, 3000);
                } else {
                    console.log('Payment failed!', paymentIntent.status);
                    setLoading(false);
                    showAlert("Register failed!", "danger");
                
                }
            }

          } else {
              // Si no hay clientSecret, significa que no se requiere un pago (suscripción gratuita)
              await updateHadSuccessfulSubscription(dataToken['token'], true);
                    setLoading(false);
                    showAlert("Successful subscription! you can now log in");
                    setName('');
                    setEmail('');

                    // Restablecer también el CardElement de Stripe si es necesario
                    // Restablecer CardElement
                    const cardElement = elements.getElement(CardElement);
                    cardElement.clear();

                    setTimeout(() => {
                      navigate("/auth");
                    }, 3000);
          }
        } catch (error) {
            setLoading(false);
            showAlert(error.message, "danger");

            console.error('Failed to register user', error);
        }
    }
  };
  
  const handleRegistrationCheck = (registered) => {
    setIsRegistered(registered);
  };

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
    }, 3000);
  };

  const validateForm = () => {
    if (!username.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      showAlert('Please fill in all fields', 'danger');
      return false;
    }
    if (childcare && !childcare.value) {
      showAlert('Please select a childcare', 'danger');
      return false;
    }
    // Aquí puedes añadir más validaciones según sea necesario
    return true;
  };
  
  const validateFormLogin = () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Please fill in all fields', 'danger');
      return false;
    }
    // Aquí puedes añadir más validaciones según sea necesario
    return true;
  };

  const validateFormCard = () => {
    if (!name.trim()) {
      showAlert('Please fill field name', 'danger');
      return false;
    }
    // Aquí puedes añadir más validaciones según sea necesario
    return true;
  };
  return (
    <div className="container-fluid d-flex h- 100">
    <div className="row justify-content-center align-items-center w-100">
      <div className="col-md-8">
            <br></br>
           
          <div className="subscription-container">
          
          <div className='title-page'>
         
            <h5>Enter your information</h5>
            <p className='border-box-tex'>Step {step} of 2</p>
          </div>
          <div className='div-alert'>
          {alertVisible && (
                      <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                        {alertMessage}
                      </Alert>
                    )}
          </div>
          
                {step === 1 && (
                   <>
                   <div className="step-container">
                  
                   <div className="title-section">
                     <h4>Enter your registration details</h4>
                     <p>Your payment will be associated with the email you entered</p>
                     
                   </div>
                     <div className="form-section">
                           
                        { !isRegistered && (
                              <RegistrationForm
                                setUsername={setUsername}
                                setPhone={setPhone}
                                setEmail={setEmail}
                                setPassword={setPassword}
                                setChildcare={setChildcare}
                                loadOptions={loadOptions}
                                username={username}
                                phone={phone}
                                email={email}
                                password={password}
                                childcare={childcare}
                              />
                            )}
                            {isRegistered && (
                              <LoginForm
                                setEmail={setEmail}
                                setPassword={setPassword}
                                email={email}
                                password={password}
                              />
                          )}
                     </div>
                     <div className="registration-check">
                        {isRegistered === false ? (
                          <p>Already have an account? <a className="link-button" onClick={() => handleRegistrationCheck(true)}>Sign in</a></p>
                        ) : isRegistered === true ? (
                          <p>Don't have an account? <a className="link-button" onClick={() => handleRegistrationCheck(false)}>Sign up</a></p>
                        ) : null}
                      </div>
                     <div className="button-section">
                       <button className="btn btn-primary " onClick={handleNextStep}>
                       {loading ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  style={{ marginRight: '8px' }}
                                />
                                Loading...
                              </>
                            ) : (
                              "Next"
                            )}
                       </button>
                       
                     </div>
                     
                   </div>
                 </>
                )}
            
                {step === 2 && (
                  <div className="step-container">
                    <div className="form-section">
                            <div className="title-section">
                            <h4>Informacion de pago</h4>
                            <p>Todas tus transacciones son seguras y encryptadas mediante la plataforma de stripe</p>
                            
                          </div>
                          <br></br>
                            <div className="form-group">
                                <label >Cardholder Name</label>
                                <input
                                  id="name"
                                  type="text"
                                  placeholder="Enter name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="form-control"
                                />
                              </div>
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
                                  }} />
                              </div>

                            <button className="subscribe-button"  onClick={handleNextStep} >
                              {loading ? (
                                <Spinner animation="border" size="sm" />
                              ) : ("Subscribe")}
                            </button>
                            <div className="message-box" style={{ color: 'red', marginTop: '0px' }}></div>
                            <div className="button-section">
                            </div>
                          <p className="disclaimer">
                              If you confirm the subscription, you will allow this payment and future payments to be charged to your card in accordance with the stipulated conditions. Payments made on the web are made through Stripe.
                            </p>
                            <div className="footer-links">
                              <a href="https://stripe.com/legal/end-users" target="_blank" rel="noopener">Conditions</a>
                              <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Privacy</a>
                            </div>
                      </div>
                  </div>
                )}
          </div>
          <br></br><br></br>
      </div>
      <div className="col-md-4 subscription-info">
        <br></br>
          <div className="subscription-title">
            <h2>Plan {title}</h2>
            <p>Recurring monthly charge</p>
            <hr></hr>
          </div>
          <div className='subscription-text'>
           
            <h5>{title === 'Free trial' ? '$0/month then $24' : 
                (title === 'Basic' ? 'Get 50% off for the first time' : 'One year of access to the best reporting options')}
                </h5>
            <p>Experience a childcare revolution with our subscription service. Save 2-5 hours of work weekly, reduce stress, personalize your approach, 
              automate repetitive tasks, and ensure compliance effortlessly.</p>
          </div>
          <div className="subscription-price">
              <div className="price-container">
                <h5>{title === 'Free trial' ? '2 months of FREE access then $24/month':(title === 'Basic' ? '1 month of access' : '1 year access')}</h5>
              </div><hr></hr>
              <div className="price-container">
                  <h5>Total to pay:</h5>
                  <h5>{price}</h5>
              </div>
           <hr></hr>
          </div>
       
          <div className="subscription-benefits">
            <ul>
              <li><strong>✓ Exclusive access:</strong> to the Daily Journal report.</li>
              <li><strong>✓ Child Care Expert:</strong> Unlimited access at any time.</li>
              <li><strong>{title === 'Basic' ? '✓':(title === 'Premium' ? '✓' :'✗')} Ask me anything (Chat):</strong> Real-time AI chat channel.</li>
              <li><strong>{title === 'Basic' ? '✗':(title === 'Premium' ? '✓' :'✗')} Personalized advice:</strong> Specialized advice for child care.</li>
            </ul>
          </div>
      </div>
    </div>
  </div>
  
  );
};

export default SubscriptionComponent;
