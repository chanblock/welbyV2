import React, { useState } from 'react';
import "../../styles/Auth.css";
import { Spinner, Alert,Modal,Button } from "react-bootstrap";
import { registerUser, loginUser, requestPasswordReset,sendDiscountEmail,getListChildCare } from '../../api'; // Import the submitDailyReport function
import { useLocation,useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';






const Auth = (props) => {
  const location = useLocation();
  const initialIsLogin = location.state?.isLogin ?? true;
  const [isLogin, setIsLogin] = useState(initialIsLogin);  // const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  //  const to alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  // const modal alert
  const [showModal, setShowModal] = useState(false);
  const [messageModal, setMessageModal] = useState("");

  // const to reset password
  const [isReset, setIsReset] = useState(false);

  // const to select childcare
  const [childcare, setChildcare] = useState(null);


  // const para redirigir a una url 
  const navigate = useNavigate();


  const showAlert = (message, type = "info") => {
    setAlertMessage(message);
    setAlertType(type); // Set the alert type
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/home');
  
  };
  const handleShowModal = (messageModal) => {
      setLoading(false);
      setMessageModal(messageModal);
      props.updateAuth(true);
      setShowModal(true);
  };

  const toggleAuthMode = () => {
    if (isReset) {
      setIsReset(false);
    } else {
      setIsLogin(!isLogin);
    }
  };

  const loadOptions = async (inputValue) => {
    const getChildCare = await getListChildCare(inputValue)
    // Transforma los datos en el formato que react-select espera
    return getChildCare.map(childcare => ({ value: childcare.ServiceApprovalNumber, label: childcare.ServiceName }));
  };
 

  const handleResetRequest = async (event) => {
    event.preventDefault();
    setLoading(true);
    const email = event.target.email.value;
    try {
      const data = await requestPasswordReset(email);
      setLoading(false);
      showAlert(data.message, "success");
    } catch (error) {
      console.error('Failed to request password reset:', error);
      showAlert("An error occurred, please try again", "danger");
      setLoading(false);
    }
  };


  const handleLogin = async (email, password) => {
   
    try {
      const data = await loginUser(email, password);
      // Aquí puedes manejar la respuesta de la API después del inicio de sesión
      // Guarda el token en el almacenamiento local
      localStorage.setItem('token', data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("subscription",data.subscription);
      localStorage.setItem("subscriptionType",data.subscription_type);
      if(data.subscription){
        localStorage.setItem("subscription_id", data.data_subscription.subscriptionId);
      }

      // Verifica si el usuario está dentro de los 30 días de acceso gratuito
      const OLD_USER_DEADLINE = new Date('2023-09-01');
      const withinFreeTrial = () => {
        const createdDate = new Date(data.created_at);
        const today = new Date();
        const isOldUser = createdDate < OLD_USER_DEADLINE;  

        let daysLeft;
        if (isOldUser) {
          const endDateForOldUser = new Date('2023-12-30');
          daysLeft = Math.ceil((endDateForOldUser - today) / (1000 * 60 * 60 * 24));
        } else {
          const daysSinceCreation = Math.ceil((today - createdDate) / (1000 * 60 * 60 * 24));
          const freeTrialDays = 30; 
          daysLeft = freeTrialDays - daysSinceCreation;
        }
      
      
        if (0 <= daysLeft && daysLeft <= 5) {
          handleShowModal(`Your free trial will expire in ${daysLeft} days. Get a 45% discount on the subscription for your first time`);
        }
      
        return daysLeft;

      };

      const isAnnualSubscription = data.subscriptionType === 'year';
      if (data.subscription === true){
        if (data.subscription_end_date) {
          const today = new Date();
          const subscriptionEndDate = new Date(data.subscription_end_date);
          console.log(subscriptionEndDate)
          const days = Math.ceil((subscriptionEndDate - today) / (1000 * 60 * 60 * 24)) * (isAnnualSubscription ? 12 : 1);
          if (days > 5 * (isAnnualSubscription ? 12 : 1)){
            localStorage.setItem("fullAccess", true);
            setLoading(false);
            props.updateAuth(true,data.userType,true);
            navigate('/home');
          }
          // Lanza una alerta cuando la suscripción esté próxima a vencerse o haya expirado
          switch (true) {
            case 0 < days && days <= 5 * (isAnnualSubscription ? 12 : 1):

              localStorage.setItem("fullAccess", true);
              handleShowModal(`Your subscription will expire in ${days} days.`);
              break;
            case days <= 0:
              localStorage.setItem("fullAccess", false);

              handleShowModal(`Your subscription expired. Please subscribe to gain full access.`);
              await sendDiscountEmail(data.token)

              break;
            default:
              break;
          }
        }
        
      }else{
        const daysSinceCreation= withinFreeTrial() * (isAnnualSubscription ? 12 : 1);
        if (daysSinceCreation > 5){
          localStorage.setItem("fullAccess", true);
          setLoading(false);
          props.updateAuth(true,data.userType,true);
          navigate('/home');
        }
     
        switch (true) {
          case 0 < daysSinceCreation && daysSinceCreation <= 5 * (isAnnualSubscription ? 12 : 1):
            localStorage.setItem("fullAccess", true);
            handleShowModal(`Your free trial will expire in ${daysSinceCreation} days. Get a 45% discount on the subscription for your first time`);
            break;
          case daysSinceCreation == 0:
              localStorage.setItem("fullAccess", true);
              handleShowModal(`Your free trial will expire today. Get a 45% discount on the subscription for your first time`);
              break;
          case daysSinceCreation == -1:
              localStorage.setItem("fullAccess", false);
              handleShowModal(`Your free trial expired. Get a 80% discount on the subscription for the next 72 hours`);
              await sendDiscountEmail(data.token)
              
              break;
          case daysSinceCreation <-1:
            localStorage.setItem("fullAccess", false);
            handleShowModal(`Your free trial expired. Please subscribe to gain full access.`);
            break;
          default:
            break;
        }
      }

    } catch (error) {
      console.error('Failed to login:', error);
      // Si hay un error en el inicio de sesión, muestra el mensaje de error
      if (error.message) {
        showAlert(error.message, "danger");
        setLoading(false);
      } else {
        showAlert('Unknown bug. Please try again.', "danger");
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (isLogin) {

      handleLogin(email, password);

    } else {
      const username = event.target.username.value;
      const phone = event.target.phone.value;
      const checkbox = event.target.userType;
      const userType = 'childcareWorker';
      const referred_user = false;
      const subcription_type = "month";
      let childcareList = []; // Valor predeterminado vacío
      if (childcare !== null) {
          childcareList = [childcare];
      }

      
      
      console.log("childcare: ", childcareList)
      try {
        const data = await registerUser(username, email, password, phone,userType,referred_user,subcription_type,childcareList);
        // const data = "hola"
        setLoading(false);
        // Aquí puedes manejar la respuesta de la API después del registro
        if (data.error) {
          setLoading(false);
          console.log("error in data register user")
          showAlert("Error in create user", "danger");

        } else {
          // Guarda el token en el almacenamiento local
          setLoading(false);
          showAlert('Sign up successful, please log in');
           // resetear el valor seleccionado en el select
          setChildcare({value: '', label: ''});
          
        }
        event.target.reset();
      } catch (error) {
        console.error('Failed to register:', error);
        setLoading(false);
        showAlert(error.message, "danger");

      }
    }
  };

  return (
    <div className="auth-container">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Hi</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModal}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Suscribe
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="auth-card">
      
        <h2>{isReset ? 'Reset Password' : (isLogin ? 'Log in' : 'Sign up')}</h2>
        <hr></hr>
        {alertVisible && (
          <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        <form className="auth-form" onSubmit={isReset ? handleResetRequest : handleSubmit} >
          {!isReset && !isLogin && (
            <>  <input
              type="text"
              name="username"
              placeholder="Username"
              required />
              <input
                type="text"
                name="phone"
                placeholder="phone"
                required />
                
            </>
          )}
      

          {isReset ? (
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          ) : (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </>
          )}
          {!isReset && !isLogin && (
            <div className="checkbox-container">

              <div className="col-12">
                  <label htmlFor="childcare">Select your Childcare:</label>
                  <AsyncSelect 
                  id="childcare"
                  loadOptions={loadOptions}
                  onChange={selectedOption => setChildcare(selectedOption)}
                  placeholder= "Type Childcare Center..."
                  />
              </div>
            
            </div>
            
          )}
          <button className="button-shared  auth-submit" type="submit">
            {isReset ? 'Request Reset' : (isLogin ? 'Log in' : 'Sign up')}
            {loading && (
              <Spinner
                animation="border"
                size="sm"
                style={{ marginLeft: '8px' }}
              />
            )}
          </button>
    

        </form>
              

           <button className="button-shared  auth-toggle " onClick={toggleAuthMode}>
        {isReset
          ? 'Back to Login'
          : (isLogin
              ? "Don't have an account? Sign up"
              : 'Do you already have an account? Log in')}
      </button>

      {!isReset && (
        <button
          className="button-shared  auth-toggle "
          onClick={() => setIsReset(true)}
        >
          Forgot Password?
        </button>
      )}
      <br></br>
     

      </div>
    </div>
  );
};


export default Auth;



