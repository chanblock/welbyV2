import React, { useState, useEffect } from 'react';
import { updateUser, getUser, getListChildCare } from '../../api';
import "../../styles/Profile.css";
import { Form, Row, Col, Button, Alert, Spinner  } from 'react-bootstrap';


import AsyncSelect from 'react-select/async';
import Select from 'react-select';


function UpdateProfile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [username, setUsername] = useState('');
  const [childcareList, setChildcareList] = useState([]);
  const [childcare, setChildcare] = useState(null);
  const [deleteChildcare, setDeleteChildcare] = useState(null);

  //const to alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  //const to spiner
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = async (inputValue) => {
    const getChildCare = await getListChildCare(inputValue)
    // Transforma los datos en el formato que react-select espera
    return getChildCare.map(childcare => ({ value: childcare.ServiceApprovalNumber, label: childcare.ServiceName }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const data = await getUser(token);

      setUser(data.user);
      setUsername(data.user.username)
      setEmail(data.user.email);
      setNumberPhone(data.user.number_phone);
      if(data.user.childcareList) {
        setChildcareList(data.user.childcareList);
    }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // Si ambos selects están llenos, muestra un mensaje de error y retorna
    if (childcare && deleteChildcare) {
      alert("Solo puedes adicionar o borrar un childcare a la vez.");
      setIsLoading(false);
      return;
    }
    // Copia la lista actual de childcares
    let updatedChildcareList = [...childcareList];

    // para actualizar campo childcare
    if (childcare) {
      const index = updatedChildcareList.findIndex(item => item.value);
      updatedChildcareList[index] = childcare;
  //         updatedChildcareList.push(childcare);

    }

    // Si se llenó el select de borrado, borra el childcare de la lista
    if (deleteChildcare) {
      updatedChildcareList = updatedChildcareList.filter(item => item.value !== deleteChildcare.value);
    }

    try {
      const token = localStorage.getItem("token");
      const updatedUser = await updateUser(token, username, email, numberPhone, updatedChildcareList);
      if (updatedUser) {
        setUser(updatedUser);
        setUsername(updatedUser.username)
        setEmail(updatedUser.email);
        setNumberPhone(updatedUser.number_phone);
        // setChildcareList(updatedUser.childcareList);
        setAlertVariant("success");
        setAlertMessage("Your profile has been updated successfully!");
        setShowAlert(true);
        
      }
    } catch (error) {
      console.error('There was an error updating the user:', error);
      setAlertVariant("danger");
      setAlertMessage('There was an error updating your profile. Please try again later.');
      setShowAlert(true);
    }
    setIsLoading(false);
  }


  return (
    <div className='profile-container'>
     
      <Form onSubmit={handleSubmit} className='updateprofile-card'>
      {showAlert && (
            <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
              {alertMessage}
            </Alert>
          )}
        <br></br>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalUsername">
          <Form.Label column sm={2}>
            Username
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalNumberPhone">
          <Form.Label column sm={2}>
            Phone Number
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="tel"
              placeholder="Phone Number"
              value={numberPhone}
              onChange={(e) => setNumberPhone(e.target.value)}
            />
          </Col>
        </Form.Group>
        {childcareList.length > 0 && (
        <>
        <fieldset>
          <Form.Group as={Row} className="mb-3">
            <Form.Label as="legend" column sm={2}>
              Childcare
            </Form.Label>
            <Col sm={10}>
              {childcareList.map((childcare, index) => (
                <React.Fragment key={index}>
                  <Form.Label>
                    - {childcare.label}
                  </Form.Label>
                  <br />
                </React.Fragment>
              ))}
            </Col>
          </Form.Group>
        </fieldset>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalChildcare">
          <Form.Label column sm={2}>
            Update Childcare
          </Form.Label>
          <Col sm={10}>
            <AsyncSelect
              id="childcare"
              loadOptions={loadOptions}
              onChange={selectedOption => setChildcare(selectedOption)}
              placeholder= "Type ChildCare Center to update... "

            />
          </Col>
        </Form.Group>
        {/* <Form.Group as={Row} className="mb-3" controlId="formHorizontalChildcare">
          <Form.Label column sm={2}>
            Delete Childcare
          </Form.Label>
          <Col sm={10}>
            <Select
              id="deleteChildcare"
              options={childcareList}
              onChange={selectedOption => setDeleteChildcare(selectedOption)}
              placeholder= "Type ChildCare Center"
            />
          </Col>
        </Form.Group> */}
        </>
        )}
        <br />
        <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Update"
                )}
              </Button>
            </Col>
          </Form.Group>
      </Form>
    </div>
  );
}

export default UpdateProfile;
