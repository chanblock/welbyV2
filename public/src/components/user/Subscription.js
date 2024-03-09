import React from 'react';
import "../../styles/Subscription.css";
import { Alert, Button } from 'react-bootstrap';

import { useContext, useEffect, useState } from 'react';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { cancelSubscription, updateCard } from '../../api';
import UpdateCardModal from './UpdateCardModal';

const Subscription = () => {
  const [subscriptionId, setSubscriptionId] = useState(localStorage.getItem('subscription_id'));
  const [userName, setUserName] = useState(localStorage.getItem("username"));
  const { subscriptionData, handleGetSubscription } = useContext(SubscriptionContext);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  useEffect(() => {
    handleGetSubscription(subscriptionId);

  }, []);

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


  // Si subscriptionData aún no está cargado, no mostramos nada
  if (!subscriptionData) return null;

  // Convertimos las fechas de inicio y fin a un formato legible
  const startDate = new Date(subscriptionData.start_date * 1000).toLocaleDateString();
  const endDate = new Date(subscriptionData.end_date * 1000).toLocaleDateString();

  // Convertimos la cantidad a dólares
  const amount = (subscriptionData.plan.amount / 100).toFixed(2);
  // Determinamos el tipo de suscripción
  const interval = subscriptionData.plan.interval;
  const intervalCount = subscriptionData.plan.interval_count;
  let subscriptionType = '';
  if (interval === 'month' && intervalCount === 1) {
    subscriptionType = 'Monthly Subscription';
  } else if (interval === 'year' && intervalCount === 1) {
    subscriptionType = 'Annual Subscription';
  } else {
    subscriptionType = 'Custom Billing Cycle';
  }

  const handleCancel = async (event) => {
    event.preventDefault();
    try {
      const confirmation = window.confirm("You are about to cancel the subscription, are you sure?");
      if (!confirmation) {
        return;
      }
      const token = localStorage.getItem('token')
      const canceledSubscription = await cancelSubscription(token, subscriptionData.id)
      if (canceledSubscription) {
        showAlert("We are sorry to see a valued subscriber go!\n We want to express our gratitude for having been part of our community and for having trusted us during this time.")
      }
       // Get the updated subscription data
      await handleGetSubscription(subscriptionId);
    } catch (error) {
      console.error('There was an error deleting the subscription user:', error);

    }

  }

  const handleUpdateCard = async (paymentMethodId) => {
    // Aquí debes enviar el nuevo método de pago al servidor
    // para actualizar la tarjeta de crédito de la suscripción.
    try {
      const token = localStorage.getItem('token');
       const updatedCard = await updateCard(token,paymentMethodId, subscriptionId)
      
       if(updatedCard.message){
          setShowModal(false);
          showAlert("The change of card was made successfully")
       }
        // Get the updated subscription data
      await handleGetSubscription(subscriptionId);
     
    } catch (error) {
      console.error(error);
    }
    console.log(paymentMethodId);

    setShowModal(false);
  }


  return (
    <div className="container ">
      <h2>Subscription Details</h2>
      <p className='lead'>Hi, {userName}: <br />Thanks for being a Welby member</p>
      {alertVisible && (
        <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <hr></hr>
      <div className="subscription-details">
        <div><strong>Start Date:</strong> {startDate}</div>
        <div><strong>End date:</strong> {endDate}</div>
        <div><strong>Payment Status:</strong> {subscriptionData.status}</div>
        <div><strong>Amount:</strong> ${amount}</div>
        <div><strong>Subscription Type:</strong> {subscriptionType}</div>
        <div><strong>Credit card currently associated {subscriptionData.card_info.brand}</strong> *** *** {subscriptionData.card_info.last4}</div>
        {subscriptionData.discount && (
          <div>
            <strong>Discount:</strong>
            {subscriptionData.discount.percent_off}%
          </div>
        )}
        <br></br>
        <div className='row'>
        <div className='col'><Button variant="dark" onClick={handleCancel} size="lg"  disabled={subscriptionData.status === "canceled"}>Cancel subscription</Button></div>
        <div className='col'><Button variant="dark" onClick={handleOpenModal} size="lg"  disabled={subscriptionData.status === "canceled"}>Update credit card</Button></div>
        </div>
        <UpdateCardModal show={showModal} handleClose={handleCloseModal} handleUpdate={handleUpdateCard} />
      
      </div>

    


   
    </div>
  );
};

export default Subscription;
