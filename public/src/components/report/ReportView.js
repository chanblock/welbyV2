import React, { useState,useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import "../../styles/Home.css";
import DatePicker from 'react-datepicker';

import { Container, Card, Button, Row, Col,Alert,Form,Modal,Spinner} from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { submitSaveReport,updateReport,fetchLastDocumentData,submitCriticalReflection} from '../../api'; // Import the submitDailyReport function
// import async from 'react-select/dist/declarations/src/async/index';




const ReportView = () => {
  const location = useLocation();
  // const para editar reporte
  const [isEditing, setIsEditing] = useState(false);
  const [showFormReflection, setShowFormReflection] = useState(false);
  const [descriptionForm, setDescriptionForm] = useState('');
  const [descriptionExtra, setDescriptionExtra] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittingPreviousVariables, setSubmittingPreviousVariables] = useState(false);

  
  const [date, setDate] = useState(new Date());
  const handleConfirm = (date) => {
    setDate(date);
};

const handlePreviousCriticalReflection = async () => {
  setSubmittingPreviousVariables(true);

  const token = localStorage.getItem('token');
  const lastVariable = await fetchLastDocumentData(token, "critical_reflection");
  const variables = lastVariable?.get_variables?.variables;
  if (variables) {
      setSubmittingPreviousVariables(false);
      setDescriptionForm(lastVariable.get_variables.variables.description);
  } else {
      setSubmittingPreviousVariables(false);
      showAlert("not variables found.");
  }
}
  const { 
    title = "", 
    content = "", 
    name = "", 
    childId = "", 
    age = "", 
    goalObservations = "",
    activities= "", 
    goalFollowUp = "",
    descriptionsFollowUp = "", 
    goals = "", 
    description = "",
    description_reflection="" ,
    descriptionPlanning="",
    rangeAgeDailyReport="",
    rangeAge,
    outCome1,
    outCome2,
    outCome3,
    outCome4,
    outCome5,
    report_id
} = location.state.reportData || {};
  const [editedContent, setEditedContent] = useState("");
 // Set the initial state of editedContent when the component mounts or content changes
 useEffect(() => {
  setEditedContent(content);
}, [content]);

 //  const to alert
 const [alertVisible, setAlertVisible] = useState(false);
 const [alertMessage, setAlertMessage] = useState("");
 const [alertType, setAlertType] = useState("info");


 const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

 const showAlert = (message,type = "info") => {
  setAlertMessage(message);
  setAlertType(type); // Set the alert type
  setAlertVisible(true);
  setTimeout(() => {
      setAlertVisible(false);
  }, 5000);
};

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      alert('The content has been copied to the clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

   const handleUpdate = async() => {
    let response;
    try {
      const data = {
          content: editedContent,
          reportId: report_id
      };
      response = await updateReport(data)
      console.log(response.status)
      if (response.status === 201) {
        // Si la actualización es exitosa, muestra un mensaje de éxito
        setAlertMessage("Update successful.");
        setAlertType("success");
        setAlertVisible(true);
      } else {
        // Si el status no es 201, puedes manejar otros códigos de estado o mostrar un mensaje genérico
        setAlertMessage("There was a problem updating.");
        setAlertType("danger");
        setAlertVisible(true);
      }
  
      setIsEditing(false); // Desactivar el modo de edición una vez guardado
      } catch (error) {
          console.error("There was an error trying to save:", error);
      }
      // Aquí coloca el código para realizar la solicitud de guardar
      
  };

  const handleSaveReport = async() => {
    const token = localStorage.getItem('token'); // Obtener el token del local storage
    const typeReport = title;
    const report = editedContent;

    try{
      // const data = await submitSaveReport(token,typeReport,report,name,childId,age,goalObservations);
      let data;

      switch (typeReport) {
          case 'Daily Report':
              data = await submitSaveReport(token, typeReport, report, null, null, null, null,null, rangeAgeDailyReport,null,null);
              break;
          case 'Weekly Planning':
              data = await submitSaveReport(token, typeReport, report,null, null, null, null, rangeAge, null,null,null);
              break;
          case 'Goal Report':
              data = await submitSaveReport(token, typeReport, report, name, childId, age,null, null,null,null,null);
              break;
          case 'Summative Assessment':
              data = await submitSaveReport(token, typeReport, report, name, childId, age,null, null,null,null,outCome1,outCome2,outCome3,outCome4,outCome5,null);
          break;
          case 'Follow up':
              data = await submitSaveReport(token, typeReport, report, name, childId, age,null, null,null, goalFollowUp,null);
              break;
          case 'Descriptions Report':
              data = await submitSaveReport(token, typeReport, report, name, childId, age, goalObservations,null, null,null,null);
              break;
          default:
              data = await submitSaveReport(token, typeReport,report,null, null, null, null,null, null,null,null);
              break;
      }
      if(data.error){
        console.log(data.error);
        alert("An error occurred, please try again");
      }
      else{
        alert("Report saved successfully","success");
      }
    } catch (error) {
      console.error(error);
      showAlert("An error occurred, please try again");

    }
  };

  const handleRedirect = (reportData) => {
    navigate("/report", { state: { reportData } });
}
  const handleSubmitCriticalReflection = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token'); // Obtener el token del local storage
      const description = descriptionForm + descriptionExtra;
      const data = await submitCriticalReflection(token, date, description);

          if (data.error) {
              showAlert(data.error);
          } else {
              setSubmitting(false);
              handleCloseFormReflection();
              const reportData = {
                  title: 'Daily Reflection',
                  content: data['response']['message'],
                  report_id:data['response']['report_id'],
                  description
              };
              handleRedirect(reportData);
              // handleRedirect('Critical Reflection', data['message']);
          }
      } catch (error) {
          console.error(error);
          showAlert("Failed to send report. Please try again later.", "danger");
          setSubmitting(false);
      }

};
const handleCleanForm = (form) => {
          setDescriptionForm('');
}
const handleShowFormReflection = () => {
  setShowFormReflection(true);
  setDescriptionForm(editedContent);

}
  const handleCloseFormReflection = () => setShowFormReflection(false);


  return (
    <Container>
      <br></br>
      <div>
      
      </div>
      <Card className="report-card">
      
      <h2 className="report-title text-center">
      { title === "Daily Report" ?
             'Daily Journal':title
          }</h2>

          <Row>


          <Col  className="d-flex align-items-center justify-content-center">
          {
                  title === "Daily Report" && (
                      <Button className="mt-2 d-none d-md-inline-block" 
                      variant="primary"
                      onClick={handleShowFormReflection}>
                         Create Reflection
                      </Button>
                  )
            }  
            </Col>
          </Row>
              
          
      <Row>
          <Button onClick={handleGoBack} variant="link">Go Back</Button>
          </Row>
        <Card.Body>
          
          <p className="lead text-center"> 
         
          { title === "Goal Report" || title === "Follow up" || title === "Descriptions Report" ?
            <><em>Child:</em><strong> {name}</strong></>: 
            null
          }
        </p>
          
          <TextareaAutosize
            className="report-content no-scrollbar"
            value={editedContent}
            readOnly={!isEditing}
            onChange={handleContentChange}
          />
          
          <br></br><br></br>
          
        </Card.Body>
        {alertVisible && (
        <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
        <Row>
            <Col md={8}></Col>
            <Col md={4}>
           
            {
                isEditing ? (
                    <Button onClick={handleUpdate} className="mt-2 d-none d-md-inline-block" variant="secondary">
                        Save
                    </Button>
                ) : (
                    <Button onClick={() => setIsEditing(true)} className="mt-2 d-none d-md-inline-block" variant="secondary">
                        Edit
                    </Button>
                )
            }{' '}
            <Button onClick={handleGoBack} className="mt-2 d-none d-md-inline-block" variant="light">
                Go Back
              </Button>{' '}
              <Button onClick={handleCopyToClipboard} className="mt-2 d-none d-md-inline-block" variant="primary">
                Copy
              </Button>{' '}
              
            </Col>
          </Row>
        <br></br>
        {
                isEditing ? (
                    <Button onClick={handleUpdate} className="mt-2 d-inline-block d-md-none copy-button" variant="secondary">
                        Save
                    </Button>
                ) : (
                    <Button onClick={() => setIsEditing(true)} className="mt-2 d-inline-block d-md-none copy-button" variant="secondary">
                        Edit
                    </Button>
                )
            }{' '}
              {
                title === "Daily Report" && (
                <Button className="mt-2 d-inline-block d-md-none copy-button" 
                variant="primary"
                onClick={handleShowFormReflection}
               
                >
                Create Reflection
                </Button>
                )
              }
        <Button onClick={handleCopyToClipboard} className="mt-2 d-inline-block d-md-none copy-button">
          Copy
        </Button>
        <Button  onClick={handleGoBack} className="mt-2 d-inline-block d-md-none copy-button" variant="light">
                  Go Back
        </Button>
      </Card>

      <Modal show={showFormReflection} onHide={handleCloseFormReflection}>
                <Modal.Header closeButton>
                    <Modal.Title>Daily Reflection</Modal.Title>
                </Modal.Header>
                {alertVisible && (
                    <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <Modal.Body>
                    <Form onSubmit={handleSubmitCriticalReflection}>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={handleConfirm}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="description">
                            <Form.Label>Describe daily reflection</Form.Label>
                            <Form.Control
                                // as="textarea"
                                // className="custom-textarea-long"
                                as={TextareaAutosize}
                                minRows={8}
                                maxRows={20}
                                value={descriptionForm}
                                placeholder="Example: Children were engaged during the group time by choosing the letter they wanted to learn during the week. Children enjoyed singing five little monkeys swinging on the tree. Children enjoyed developing arts and crafts about letters and they remember easily what word start whit the letter, in this case P for piggy.Some parents are worried about their child emotional manage because they mention they do not know how to manage it, because the children do not have self-regulation. Many children need to improve their help-self skills"
                                onChange={(e) => setDescriptionForm(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="descriptionExtra">
                            <Form.Label>Write what work well or what to improve</Form.Label>
                            <Form.Control
                                // as="textarea"
                                // className="custom-textarea-long"
                                as={TextareaAutosize}
                                minRows={5}
                                maxRows={10}
                                value={descriptionExtra}
                                placeholder="Example: Children were engaged during the group time by choosing the letter they wanted to learn during the week. Children enjoyed singing five little monkeys swinging on the tree. Children enjoyed developing arts and crafts about letters and they remember easily what word start whit the letter, in this case P for piggy.Some parents are worried about their child emotional manage because they mention they do not know how to manage it, because the children do not have self-regulation. Many children need to improve their help-self skills"
                                onChange={(e) => setDescriptionExtra(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br></br>


                        <br />
                        <Button className="button-space" variant="primary" type="submit" disabled={submitting} size="sm">
                            {submitting ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Submit"
                            )}

                             
                        </Button>
                       
                        <Button className="button-space" variant="secondary" onClick={handlePreviousCriticalReflection} disabled={submittingPreviousVariables} size="sm">
                            {submittingPreviousVariables ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Previous Variables"
                            )}
                        </Button>
                        <Button variant="light" onClick={() => handleCleanForm('critical_reflection')} size="sm" >
                            Clean 
                        </Button>

                    </Form>
                </Modal.Body>
            </Modal>
    </Container>

    

  );
};

export default ReportView;
