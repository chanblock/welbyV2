
import React,  {  useState }from 'react';
import ChildForm from '../../childcomponents/ChildForm';

const ObservationsModal = () => {
    const [selectedChild, setSelectedChild] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState(""); const [showObservations, setShowObservations] = useState(false);
    const [goalObservations, setGoalObservations] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const handleCloseObservations = () => setShowObservations(false);
    const handleShowObservations = () => setShowObservations(true);

    const handleSubmitObservations = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token'); // Obtener el token del local storage
            const data = await submitObservations(token, date, name, age, goalObservations, descriptions); // Use the imported function
            // const data = await response.json();

            // Simulación de una petición que tarda 2 segundos en completarse
            if (data.error) {
                showAlert(data.error);
            } else {
                // setFormData({ date, name, age, goalObservations, descriptions });
                setSubmitting(false);
                handleClose();
                const childId = selectedChild._id;
                const reportData = {
                    title: 'Descriptions Report',
                    content: data['response']['message'],
                    report_id:data['response']['report_id'],
                    name,
                    childId,
                    age,
                    goalObservations,

                };
                handleRedirect(reportData);
                // handleRedirect('Descriptions Report', data['message'], name, childId, age, goalObservations);
            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }
    };

  return (
    // JSX code for the modal component
    <Modal show={showObservations} onHide={handleCloseObservations}>

                <Modal.Header closeButton>
                    <Modal.Title>Report Observations</Modal.Title>
                </Modal.Header>
                {alertVisible && (
                    <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <Modal.Body>
                    <ChildForm
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        isSubmittingChild={isSubmittingChild}
                        handleSubmitChild={handleSubmitChild}
                        childName={childName}
                        setChildName={setChildName}
                        childAge={childAge}
                        setChildAge={setChildAge}
                        setBirthDate={setBirthDate}
                        childCare={childCare}
                        setChildCare={setChildCare}
                    />
                    <Form onSubmit={handleSubmitObservations} >
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={handleConfirm}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedChild ? selectedChild._id : ""}
                                onChange={(e) => {
                                    const selected = childs.find(child => child._id === e.target.value);
                                    if (selected) {
                                        setSelectedChild(selected);
                                        setName(selected.child_name);
                                        setAge(selected.age);
                                    } else {
                                        console.log("No child found with id: ", e.target.value);
                                    }
                                }}
                                required
                            >

                                <option value="" disabled={selectedChild !== ""}>Select child</option>
                                {childs.length > 0 ? (
                                    childs.map((child) => (
                                        <option key={child._id} value={child._id}>
                                            {child.child_name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No children available, please add a child.</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="link" onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Add Child'}</Button>

                        <br />
                        <Form.Group controlId="age">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                value={age}
                                placeholder="Example: 1,7"
                                onChange={(e) => setAge(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="goals">
                            <Form.Label>Goals</Form.Label>
                            <FormControl
                                // as="textarea"
                                as={TextareaAutosize}
                                minRows={4}
                                maxRows={6}
                                placeholder="Example: To assist Jasper in developing his fine motor skills"
                                value={goalObservations}
                                onChange={(e) => setGoalObservations(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="goals">
                            <Form.Label>Descriptions</Form.Label>
                            <FormControl
                                as="textarea"
                                className="custom-textarea-long"
                                placeholder="Example: Jasper was drawn to the paper-cutting-with-scissors activity. He sat in the chair and very attentively waited for the teacher's instructions to start developing the activity. bJasper enjoyed cutting the paper into small pieces. Jasper successfully completed the activity showing that his fine motor skills have greatly improved."
                                value={descriptions}
                                onChange={(e) => setDescriptions(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <br />
                        <Button className="button-space" variant="primary" type="submit" disabled={submitting} size="sm">
                            {submitting ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                        <Button className="button-space" variant="secondary" onClick={handlePreviousObservations} disabled={submittingPreviousVariables} size="sm" >
                            {submittingPreviousVariables ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Previous Variables"
                            )}
                        </Button>
                        <Button variant="light" onClick={() => handleCleanForm('descriptions_report')} size="sm" >
                            Clean
                        </Button>

                    </Form>
                </Modal.Body>
            </Modal>
  );
};

export default ObservationsModal;
