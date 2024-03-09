import { useState } from 'react';
import { Spinner,Modal, Button, Form } from 'react-bootstrap';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import "../../styles/Subscription.css";

const UpdateCardModal = ({ show, handleClose, handleUpdate }) => {
  const [cardName, setCardName] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: { name: cardName },
    });

    if (!error) {
      handleUpdate(paymentMethod.id);
      
    }

    setSubmitting(false);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Credit Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          
          <Form.Group>
            <Form.Label>Card Information</Form.Label>
            <CardElement className='stripe-card-element'
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
          </Form.Group>
          <br />
          <Button variant="primary" type="submit"  disabled={submitting}>
          {submitting ? (
            <Spinner animation="border" size="sm" />
              ) : ("Update Card")}</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateCardModal;
