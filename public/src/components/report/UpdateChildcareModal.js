import React, { useState } from 'react';
import { Spinner,Modal, Button, Form, Alert } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { getListChildCare} from "../../api";




export function UpdateChildcareModal({ isOpen, setIsOpen, handleUpdate }) {
  const [childcare, setChildcareInput] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);


  const loadOptions = async (inputValue) => {
    const getChildCare = await getListChildCare(inputValue);
    return getChildCare.map(childcare => ({ value: childcare.ServiceApprovalNumber, label: childcare.ServiceName }));
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate(childcare);
  };


  return (
    <div>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update childCare</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
              <Form.Group>
                  <Form.Label>Select your Childcare</Form.Label>
                  <div className="col-12">
                      <AsyncSelect 
                          id="childcare"
                          loadOptions={loadOptions}
                          onChange={selectedOption => {
                              setChildcareInput(selectedOption);
                              setShowError(false);
                          }}
                          placeholder= "Type Childcare Center..."
                      />
                  </div>
              </Form.Group>
              {showError && <Alert variant="danger">Please select a childcare center.</Alert>}
              <br />
              <Button variant="primary" type="submit" disabled={!childcare || submitting}>
                  {submitting ? (
                      <Spinner animation="border" size="sm" />
                  ) : ("Update child care")}
              </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

