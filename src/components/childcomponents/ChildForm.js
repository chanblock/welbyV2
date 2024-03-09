import React, { useEffect, useState } from 'react';
import { Collapse, Form, FormGroup, FormControl, Button, Spinner, Row, Col } from 'react-bootstrap';
import { getUser } from '../../api';
import Select from 'react-select';


function ChildForm({ isOpen, setIsOpen, isSubmittingChild, handleSubmitChild, childName, setChildName, childAge, setChildAge, childCare, setChildCare,setBirthDate }) {
    const [childcareList, setChildcareList] = useState([]);

    useEffect(() => {
        const fetchChildCare = async () => {
            const token = localStorage.getItem('token');
            const data = await getUser(token);
            const list = data.user.childcareList;
            setChildcareList(list);
            if (list.length > 0) {
                setChildCare(list[0]);
            }
        }
        fetchChildCare();
    }, []);

    return (
        <Collapse in={isOpen}>
            <Form onSubmit={handleSubmitChild} className="form-child">
                <p className="form-notice">
                    <strong><em>Children names are encrypted to keep secure their identity.</em></strong>
                </p>
                <FormGroup controlId="childName" className="form-group-custom">
                    <FormControl value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Child name " required />
                </FormGroup>
                <FormGroup controlId="childAge" className="form-group-custom">
                    <FormControl type="number" value={childAge} onChange={(e) => setChildAge(e.target.value)} placeholder="Age" required />
                </FormGroup>
                <FormGroup>
                    <Form.Label>Date of Birth (Optional)</Form.Label>
                    <FormControl type="date" onChange={(e) => setBirthDate(e.target.value)}/>
                </FormGroup>
                <Button variant="link" type="submit" disabled={isSubmittingChild} >
                    {isSubmittingChild ? <Spinner animation="border" size="sm" /> : <strong>Add Child</strong>}
                </Button>
                <Button variant="link" onClick={() => setIsOpen(!isOpen)}>Close</Button>
            </Form>
        </Collapse>
    );
}

export default ChildForm;
