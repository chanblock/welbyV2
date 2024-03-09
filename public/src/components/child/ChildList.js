import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form,FormGroup, FormControl,Row,Col, Spinner,Alert } from 'react-bootstrap';
import { useChilds } from '../childcomponents/useChilds';
import { getListChilds,getUser,updateChild,deleteChild,addNewChild } from '../../api';
import Select from 'react-select';
import "../../styles/Home.css";
import AudioRecorder from '../report/AudioRecorder'; // Asegúrate de que la ruta sea correcta.



function ChildList() {
    const { childs, setChilds } = useChilds();
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState('');
    const [childId, setChildId] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [childcareList, setChildcareList] = useState([]);
    const [childCare,  setChildCare] = useState('');

     //const to alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [spinnerButton, setSpinnerButton]= useState(false);
    const [spinnerButtonCreate, setSpinnerButtonCreate]= useState(false);


     // Estado para el estado de carga:
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(null);  // Estado para rastrear el token

    const [showCreateModal, setShowCreateModal] = useState(false);

    
    // PRUEBA DE GRABACION 
    const [showRecorder, setShowRecorder] = useState(false);

    
    //******************PRUEBA COMPACTACION DE USEEFFECT */
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Manejar caso sin token. Por ejemplo, redirigir al inicio de sesión o mostrar un mensaje de error.
            return;
        }

        // Obtener la lista de cuidadores
        const getChildCare = async () => {
            const data = await getUser(token);
            setChildcareList(data.user.childcareList);
        }

        // Obtener la lista de niños
        const fetchChilds = async () => {
            setIsLoading(true);  // Comienza mostrando el estado de carga
            try {
                const data = await getListChilds(token);
                setChilds(data.data);
            } catch (error) {
                console.error('Error fetching childs:', error);
                // Aquí podrías manejar errores, por ejemplo mostrando un mensaje al usuario
            } finally {
                setIsLoading(false);  // Termina el estado de carga
            }
        };

        // Llamar a las funciones
        getChildCare();
        fetchChilds();
    }, [setChilds]);

   
    if (!Array.isArray(childs)) {
        return <div>Loading...</div>; // Agregar un estado de carga mientras se obtiene la lista de niños
    }

   
    const handleUpdate = (child) => {
        // Tu lógica para manejar la actualización
        setSelectedChild(child);
        setShowUpdateModal(true);
        if (typeof child.childcare === 'object') {
            setChildCare({ value: child.childcare.value, label: child.childcare.label });
        }
        setChildName(child.child_name);
        setChildAge(child.age);

    }

    const handleDelete = async(childId) => {
        // Tu lógica para manejar el borrado
        if (!window.confirm("Are you sure you want to delete this child?")) {
            return;
        }
        setSpinnerButton(true)

        try {
           const deletedChild = await deleteChild(childId)
           if(deletedChild){
            setAlertVariant("success");
                setAlertMessage("Child has been deleted successfully!");
                setShowAlert(true);
                const fetchChilds = async () => {
                    const token = localStorage.getItem("token");
                    const data = await getListChilds(token);
                    setChilds(data.data);
                };
                fetchChilds();
           }

        } catch (error) {
            console.error('There was an error deleting the user:', error);
            setAlertVariant("danger");
            setAlertMessage('There was an error deleting . Please try again later.');
            setShowAlert(true);
            setSpinnerButton(false)

        }
        setSpinnerButton(false)


    }
 

    const handleSubmit = async(event) =>{
        event.preventDefault();
        setSpinnerButton(true)
        try {
            const tokenChildWorker = localStorage.getItem("token");
            setChildId(selectedChild._id)
            const updatedChild = await updateChild(selectedChild._id,childName,childAge,childCare,tokenChildWorker,birthDate)
            if (updatedChild) {
                setAlertVariant("success");
                setAlertMessage("Child has been updated successfully!");
                setShowAlert(true);
                const fetchChilds = async () => {
                    const token = localStorage.getItem("token");
                    const data = await getListChilds(token);
                    setChilds(data.data);
                };
                fetchChilds();
                handleClose()


            }
            setSpinnerButton(false)

            
        } catch (error) {
            console.error('There was an error updating the user:', error);
            setAlertVariant("danger");
            setAlertMessage('There was an error updating . Please try again later.');
            setShowAlert(true);
        }

    }

    const handleClose = () => setShowUpdateModal(false);

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    const renderChildcare = (childcare) => {
        if (Array.isArray(childcare)) {
            return childcare.map((c, index) => <td key={index}>{c}</td>);
        } else if (typeof childcare === 'object') {
            return <td>{childcare.label}</td>;
        } else {
            return <td>{childcare}</td>;
        }
    }

    const handleCreate = () => {
        // Restablece las variables de estado si es necesario
        setChildName('');
        setChildAge('');
        setBirthDate(null);
        setShowCreateModal(true);
    }

    const handleAddChild = async (event) => {
        event.preventDefault();
        setSpinnerButtonCreate(true)
        // Lógica para agregar un nuevo "child"
        // Dependerá de tu API y lógica de negocio
        const token = localStorage.getItem('token');

        const response = await addNewChild(token, childName, childAge, childCare,birthDate);
        if (response.error) {
             // Después de agregar exitosamente el "child", cierra el modal y obtén la lista actualizada
             setSpinnerButtonCreate(false);
             setShowCreateModal(false);
            setAlertVariant("danger");
            setAlertMessage("Error adding child.");
            setShowAlert(true);

        } else {
             // Después de agregar exitosamente el "child", cierra el modal y obtén la lista actualizada
             setSpinnerButtonCreate(false);
             setShowCreateModal(false);
            setAlertVariant("success");
            setAlertMessage("Child added successfully.");
            setShowAlert(true);
            const fetchChilds = async () => {
                const token = localStorage.getItem("token");
                const data = await getListChilds(token);
                setChilds(data.data);
            };
            fetchChilds();

        }
       
    }

    return (
        <div className="container fullscreen-minheight-div">
            {showAlert && (
            <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
              {alertMessage}
            </Alert>
          )}
            
            
            <h1 className=" text-center display-6"><em><strong>Children list</strong></em></h1>
            {/* <button onClick={() => setShowRecorder(!showRecorder)}>
            {showRecorder ? 'Ocultar Grabadora' : 'Mostrar Grabadora'}
            </button>
            {showRecorder && <AudioRecorder />} */}
            <p className="text-center lead">
            <Button variant="primary" onClick={handleCreate}>Add Child</Button><br></br>
                    <strong><em>Children names are encrypted to keep secure their identity.</em></strong>
                </p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Child Name</th>
                        <th>Age</th>
                        <th>Option</th>

                        
                    </tr>
                </thead>
                <tbody>
                {
                childs.length === 0 ? (
                    <tr> 
                        <td colSpan="3" className="text-center display-6">
                            <h2>List is empty</h2>
                        </td>
                    </tr>
                ) : (

                    childs.map((child) => (
                        <tr key={child._id}>
                            <td>{child.child_name}</td>
                            {/* <td>{child.age} */}
                            <td>
                                {child.birth_date ? calculateAge(child.birth_date) : child.age}
                            </td>
                            {/* {renderChildcare(child.childcare)} */}
                            <td>
                                <Button variant="info" onClick={() => handleUpdate(child)}>Update</Button>
                                {' '}<Button variant="danger" onClick={() => handleDelete(child._id)}>
                                    Delete

                                </Button>
                            </td>
                        </tr>
                    ))
                )
                }
                </tbody>
            </Table>

            <Modal show={showUpdateModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Child</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formChildName">
                            <Form.Label>Child Name</Form.Label>
                            <Col >
                                <Form.Control
                                type="text"
                                placeholder="child name"
                                value={childName}
                                onChange={(e) => setChildName(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group controlId="formChildName">
                            <Form.Label>Age</Form.Label>
                            <Col >
                                <Form.Control
                                type="text"
                                placeholder="child name"
                                value={childAge}
                                onChange={(e) => setChildAge(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <FormGroup>
                            <Form.Label>Date of Birth (Optional)</Form.Label>
                            <FormControl type="date" onChange={(e) => setBirthDate(e.target.value)}/>
                        </FormGroup>
                        <Modal.Footer>
                    <Button variant="primary" type="submit" disabled={spinnerButton}  >
                        {spinnerButton ? (
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

                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer> 
                    </Form>
                </Modal.Body>
               
            </Modal>
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Child</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddChild}>
                        <Form.Group controlId="formChildName">
                            <Form.Label>Child Name</Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="child name"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group controlId="formChildAge">
                            <Form.Label>Age</Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="age"
                                    value={childAge}
                                    onChange={(e) => setChildAge(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <FormGroup>
                            <Form.Label>Date of Birth (Optional)</Form.Label>
                            <FormControl type="date" onChange={(e) => setBirthDate(e.target.value)}/>
                        </FormGroup>
                        <Modal.Footer>
                            <Button variant="primary" type="submit" disabled={spinnerButtonCreate} >
                            {spinnerButtonCreate ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                ) : (
                                "Add"
                                )}
                            </Button>
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default ChildList;
