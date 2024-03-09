import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/CardModern.css";
import "../styles/Home.css";
import "../styles/Auth.css";
import { Button, Modal, Form, FormControl, Spinner, Alert, Row, Col, FormGroup } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {submitSummativeAssessment, submitDailyReport, submitGoal, submitObservations, submitCriticalReflection, submitHistoricalReport, submitWeeklyPlanning, submitWeeklyReflection, submitGetVariablesReports, submitFollowUp, fetchLastDocumentData} from '../api/report'; 
import {UpdateFieldUser,getUser} from "../api/user";
import{UpdateAllChildren,getListChilds,addNewChild} from "../api/childs";
import { checkSubscription } from "../api/payment";
import ChildForm from "./childcomponents/ChildForm";
import { UpdateChildcareModal } from "./report/UpdateChildcareModal";
import { useReports} from "../context/ReportContext";
import TextareaAutosize from 'react-textarea-autosize';
const Home = () => {
    const { setReports } = useReports();
    const [fullAccess, setFullAccess] = useState(localStorage.getItem("fullAccess") === "true");
    const updateFullAccessStatus = async () => {
        try {
            // Reemplaza 'getUserData' con la función que obtiene la información del usuario a través de la API.
            const userData = await checkSubscription(localStorage.getItem("token"));

            if (userData.subscription_end_date !== false) {
                const today = new Date();
                const subscriptionEndDate = new Date(userData.subscription_end_date);
                const days = Math.ceil((subscriptionEndDate - today) / (1000 * 60 * 60 * 24));
                if (days <= 0) {
                    localStorage.setItem("fullAccess", false);
                    setFullAccess(false);
                } else {
                    localStorage.setItem("fullAccess", true);
                    setFullAccess(true);
                }
            }
            // Asegúrate de actualizar el estado de fullAccess después de cambiar el valor en localStorage
        } catch (error) {
            console.error('Failed to update full access status:', error);
        }
    };

    useEffect(() => {
        // Verifica si el usuario está autenticado antes de llamar a 'updateFullAccessStatus'
        if (localStorage.getItem("token")) {
            updateFullAccessStatus();
        }
    }, []);
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'fullAccess') {
                setFullAccess(e.newValue === "true");
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Limpieza al desmontar el componente
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // const gnrl
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [date, setDate] = useState(new Date());
    const handleConfirm = (date) => {
        setDate(date);
    };

    const [childs, setChilds] = useState([]);
    const [selectedChild, setSelectedChild] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchChilds = async () => {
            const data = await getListChilds(token);
            setChilds(data.data);
        };

        fetchChilds();
    }, []);


    // const report view
    const navigate = useNavigate();
    // const spinner Previous variables 
    const [submittingPreviousVariables, setSubmittingPreviousVariables] = useState(false);

    // const daily report
    const [show, setShow] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activities, setActivities] = useState("");
    const [rangeAgeDailyReport, setRangeAgeDailyReport] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = async () => setShow(true);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const handleUpdate = async (childcareInput) => {
        // Aquí puedes llamar a la función que actualiza el campo del usuario
        const token = localStorage.getItem('token');
        try {

            const result = await UpdateFieldUser(token, 'childcareList', childcareInput);
            const updatedAllChildren = await UpdateAllChildren(token, 'childcare', childcareInput)
            console.log("User field updated with result: ", childcareInput);
            showAlert("childcare successfully added")
        } catch (error) {
            console.error('Failed to update user field: ', error);
        }
        console.log("Updating user field...", childcareInput);
        setIsOpenModal(false);
    };
    const handleCreateClick = async () => {
        const token = localStorage.getItem('token'); // Obtener el token del local storage

        // Obtener los datos del usuario
        const userData = await getUser(token);
        // Validar si userData tiene el campo childcareList
        if (!userData.user.childcareList) {
            alert("Hi there, please update your childcare center name");
            setIsOpenModal(true);
            return;
        }

        // Si todo está bien, abre el modal
        handleShow();
    };


    // const to goal
    const [showGoal, setShowGoal] = useState(false);
    const [goals, setGoals] = useState('');
    const handleCloseGoal = () => setShowGoal(false);
    const handleShowGoal = () => setShowGoal(true);


    // const to Observations
    const [showObservations, setShowObservations] = useState(false);
    const [goalObservations, setGoalObservations] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const handleCloseObservations = () => setShowObservations(false);
    const handleShowObservations = () => setShowObservations(true);

    // const Critical Reflection
    const [showFormReflection, setShowFormReflection] = useState(false);
    const [description, setDescription] = useState('');
    const handleCloseFormReflection = () => setShowFormReflection(false);
    const handleShowFormReflection = () => setShowFormReflection(true);

    // const Weekly Reflection
    const [showFormWeeklyReflection, setShowFormWeeklyReflection] = useState(false);
    const [description_reflection, setDescriptionReflection] = useState('');
    const handleCloseFormWeeklyReflection = () => setShowFormWeeklyReflection(false);
    const handleShowFormWeeklyReflection = () => setShowFormWeeklyReflection(true);

    // const Weekly Planning
    const [showFormWeeklyPlanning, setShowFormWeeklyPlanning] = useState(false);
    const [descriptionPlanning, setDescriptionPlanning] = useState('');
    const [rangeAge, setRangeAgePlanning] = useState('');
    const handleCloseFormWeeklyPlanning = () => setShowFormWeeklyPlanning(false);
    const handleShowFormWeeklyPlanning = () => setShowFormWeeklyPlanning(true);

    // const to follow up
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [goalFollowUp, setGoalFollowUp] = useState('');
    const [descriptionsFollowUp, setDescriptionsFollowUp] = useState('');
    const handleCloseFollowUp = () => setShowFollowUp(false);
    const handleShowFollowUp = () => setShowFollowUp(true);

    // const summative assessment
    const [showSummativeAssessment, setShowSummativeAssessment] = useState(false);
    const [outCome1, setOutCome1] = useState('');
    const [outCome2, setOutCome2] = useState('');
    const [outCome3, setOutCome3] = useState('');
    const [outCome4, setOutCome4] = useState('');
    const [outCome5, setOutCome5] = useState('');
    const handleCloseSummativeAssessment = () => setShowSummativeAssessment(false);
    const handleShowSummativeAssessment = () => setShowSummativeAssessment(true);


    // add child
    const [isOpen, setIsOpen] = useState(false);
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState('');
    const [childCare, setChildCare] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [isSubmittingChild, setIsSubmittingChild] = useState(false);

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
        }, 5000);
    };

    const [showTutorial, setShowTutorial] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");

    const handleShowTutorial = (videoUrl) => {
        setCurrentVideoUrl(videoUrl);
        setShowTutorial(true);
    };

    const handleCloseTutorial = () => {
        setShowTutorial(false);
    };

    const handlePreviousFollowUp = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "follow_up");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setGoalFollowUp(lastVariable.get_variables.variables.goals);
            setDescriptionsFollowUp(lastVariable.get_variables.variables.descriptions)
        } else {
            setSubmittingPreviousVariables(false);
            showAlert("not variables found.");
        }

    }

    const handleRedirect = (reportData) => {
        navigate("/report", { state: { reportData } });
    }


      //  ojo pendiente por revisar el modal para el susbscripcion 
      //Estado para manejar la visibilidad del modal
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Función para abrir el modal
  const handleOpenModal = () => setShowInfoModal(true);

  // Función para cerrar el modal
  const handleCloseModal = () => setShowInfoModal(false);

  
  const handleBuyClick = () => {
    // Cierra el modal de información
    setShowInfoModal(false);
    // Abre el modal de pago
    setShowPaymentModal(true);
  };

    const handleSubmitChild = async (e) => {
        e.preventDefault();
        setIsSubmittingChild(true);
        const token = localStorage.getItem('token');

        const response = await addNewChild(token, childName, childAge, childCare,birthDate);
        if (response.error) {
            setIsSubmittingChild(false);
            showAlert("Error adding child.", "danger");
        } else {
            setIsSubmittingChild(false);
            showAlert("Child added successfully, you can select the child.", "success");
            const data = await getListChilds(token);
            setChilds(data.data);


        }

        setIsSubmittingChild(false);
    }


    const handlePreviousVariablesDailyReport = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "daily_report");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setActivities(lastVariable.get_variables.variables.activities)
        } else {
            setSubmittingPreviousVariables(false);
            showAlert("not variables found.");

        }
    }

    const handlePreviousGoal = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "goal_report");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            // setName(lastVariable.get_variables.variables.name);
            // setAge(lastVariable.get_variables.variables.age);
            setGoals(lastVariable.get_variables.variables.goals);
        } else {
            setSubmittingPreviousVariables(false);
            showAlert("not variables found.");
        }
    }

    const handlePreviousObservations = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "descriptions_report");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setDescriptions(lastVariable.get_variables.variables.descriptions);
            setGoalObservations(lastVariable.get_variables.variables.goal_observations)
        } else {
            setSubmittingPreviousVariables(false);
            showAlert("not variables found.");
        }
    }

    const handlePreviousCriticalReflection = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "critical_reflection");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setDescription(lastVariable.get_variables.variables.description);
        } else {
            setSubmittingPreviousVariables(false);
            showAlert("not variables found.");
        }
    }

    const handlePreviousWeeklyReflection = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "weekly_reflection");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            if (lastVariable.get_variables.variables.descriptions) {
                setDescriptionReflection(lastVariable.get_variables.variables.descriptions);
            }
        } else {
            setSubmittingPreviousVariables(false);
            showAlert("not variables found.");
        }
    }

    const handlePreviousWeeklyPlanning = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "weeklyn_planning");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            if (lastVariable.get_variables.variables.range_age) {
                setDescriptionReflection(lastVariable.get_variables.variables.range_age);
            }
            setDescriptionPlanning(lastVariable.get_variables.variables.goals)
        } else {
            setSubmittingPreviousVariables(false);
            showAlert("not variables found.");
        }
    }


    const handlePreviousSummativeAssessment = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "summative_assessment");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setOutCome1(lastVariable.get_variables.variables.outCome1);
            setOutCome2(lastVariable.get_variables.variables.outCome2);
            setOutCome3(lastVariable.get_variables.variables.outCome3);
            setOutCome4(lastVariable.get_variables.variables.outCome4);
            setOutCome5(lastVariable.get_variables.variables.outCome5);

        } else {
            setSubmittingPreviousVariables(false);
            showAlert("not variables found.");
        }
    }

    const handleCleanForm = (form) => {
        switch (form) {
            case 'descriptions_report':
                setDescriptions('');
                setGoalObservations('')
                break;
            case 'daily_report':
                setActivities('')
                break;
            case 'goal_report':
                setGoals('');
                break;
            case 'critical_reflection':
                setDescription('');
                break;
            case 'weekly_reflection':
                setDescriptionReflection('');

                break;
            case 'weeklyn_planning':
                setDescriptionReflection('');
                setDescriptionPlanning('');
                break;
            case 'follow_up':
                setGoalFollowUp('');
                setDescriptionsFollowUp('');
                break;
            case 'summative_assessment':
                setOutCome1('');
                setOutCome2('');
                setOutCome3('');
                setOutCome4('');
                setOutCome5('');
                break;
            default:
                console.log('Formulario no reconocido:', form);

        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token'); // Obtener el token del local storage
            const data = await submitDailyReport(token, rangeAgeDailyReport, date, activities);
            if (data.error) {
                showAlert(data.error, "danger");
            } else {

                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Daily Report',
                    content: data['response']['message'],
                    report_id:data['response']['report_id'],
                    activities,
                    rangeAgeDailyReport,

                };
                handleRedirect(reportData);
                // handleRedirect('Daily Report', data['message']);
            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }

    };

    const handleSubmitGoal = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token'); // Obtener el token del local storage
            const data = await submitGoal(token, date, name, age, goals); // Use the imported function
            // const data = await response.json();

            setSubmitting(false);
            handleClose();
            const childId = selectedChild._id;
            const reportData = {
                title: 'Goal Report',
                content: data['response']['message'],
                report_id:data['response']['report_id'],
                name,
                childId,
                age,
                goals,
            };
            handleRedirect(reportData);
            // handleRedirect('Goal Report', data['message'], name, childId, age);


        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);

        }

    };

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
    const handleSubmitCriticalReflection = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token'); // Obtener el token del local storage
            const data = await submitCriticalReflection(token, date, description);

            if (data.error) {
                showAlert(data.error);
            } else {
                setSubmitting(false);
                handleClose();
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

    const handleHistoricalReportSubmission = async (typeReport) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            // Guardar el tipo de reporte en el localStorage
            localStorage.setItem("typeReport", typeReport);
            const data = await submitHistoricalReport(token, typeReport);
            // Filtrar los reportes con el mismo 'typeReport'
            const filteredReports = data.list_report.filter(report => report.type_report === typeReport);

            // Establecer los reportes en el contexto
            setReports(filteredReports);
            // Redirigir a la vista de reportes y pasar la data como estado de ubicación      
            navigate('/reports-list');
           

        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }
    };

    const handleSelectReportReflectionSubmission = async (typeReport) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const data = await submitGetVariablesReports(token, typeReport);

            // Filtrar los reportes con el mismo 'typeReport'
            const filteredReports = data.get_report.filter(report => report.type_report === typeReport);

            // Redirigir a la vista de reportes y pasar la data como estado de ubicación
            navigate('/select_report_reflection', { state: { reports: filteredReports } });
        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }
    };
    const handleSubmitWeeklyReflection = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const data = await submitWeeklyReflection(token, date, description_reflection);
            setSubmitting(false);
            handleClose();

            if (data.error) {
                showAlert("Error");
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Weekly Critical Reflection',
                    content: data['response']['message'],
                    report_id:data['response']['report_id'],
                    description_reflection
                };
                handleRedirect(reportData);
            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }

    }
    const handleSubmitWeeklyPlanning = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const data = await submitWeeklyPlanning(token, date, rangeAge, descriptionPlanning);

            if (data.error) {
                showAlert(data.error);
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Weekly Planning',
                    content: data['response']['message'],
                    report_id:data['response']['report_id'],
                    rangeAge,
                    descriptionPlanning
                };
                handleRedirect(reportData);
            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to send. Please try again later.", "danger");
            setSubmitting(false);
        }

    }

    const handleSubmitFollowUp = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token'); // Obtener el token del local storage
            const data = await submitFollowUp(token, date, name, age, goalFollowUp, descriptionsFollowUp); // Use the imported function
            // const data = await response.json();

            // Simulación de una petición que tarda 2 segundos en completarse
            if (data.error) {
                showAlert(data.error);
            } else {
                setSubmitting(false);
                handleClose();
                const childId = selectedChild._id;
                const reportData = {
                    title: 'Follow up',
                    content: data['response']['message'],
                    report_id:data['response']['report_id'],
                    name,
                    childId,
                    age,
                    goalFollowUp,
                    descriptionsFollowUp,
                };
                handleRedirect(reportData);
                // handleRedirect('Follow up', data['message'], name, childId, age, goalFollowUp);


            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }

    }

    const handleSubmitSummativeAssessment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {


            const outComes = {
                'outCome1': outCome1,
                'outCome2': outCome2,
                'outCome3': outCome3,
                'outCome4': outCome4,
                'outCome5': outCome5
            }
            const token = localStorage.getItem('token'); // Obtener el token del local storage
            const data = await submitSummativeAssessment(token, date, name, age, outComes); // Use the imported function

            if (data.error) {
                showAlert(data.error);
            } else {
                setSubmitting(false);
                handleClose();
                const childId = selectedChild._id;
                const reportData = {
                    title: 'Summative Assessment',
                    content: data['response']['message'],
                    report_id:data['response']['report_id'],
                    name,
                    childId,
                    age,
                    outCome1,
                    outCome2,
                    outCome3,
                    outCome4,
                    outCome5
                };
                handleRedirect(reportData);
            }

        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }
    }

    return (
        <div className="home-container">
            {showTutorial &&
                <Modal show={showTutorial} onHide={handleCloseTutorial} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Tutorial Video</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <iframe width="100%" height="315" src="https://www.youtube.com/embed/MrTz5xjmso4?si=hg-roG7Md9N8CnW9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
                        <iframe
                            width="100%"
                            height="315"
                            src={currentVideoUrl}
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen>
                        </iframe>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseTutorial}>Close</Button>
                    </Modal.Footer>
                </Modal>

            }
            <UpdateChildcareModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} handleUpdate={handleUpdate} />
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Daily Journal</Modal.Title>
                </Modal.Header>
                {alertVisible && (
                    <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={handleConfirm}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="rangeAgeDailyReport">
                            <Form.Label>Range age</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Example: 1-2"
                                value={rangeAgeDailyReport}
                                onChange={(e) => setRangeAgeDailyReport(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="activities">
                            <Form.Label>Activities</Form.Label>
                            <Form.Control
                                as="textarea"
                                className="custom-textarea-long"
                                placeholder="Example: Morning activity: playing in the outdoor area, Group time: they sang five little monkeys swinging in the tree to remain of numbers, they recognized the numbers 1 and 2 written in two balloons that were inflated, next activity: letter Aa by Through songs and examples , next activity: arts and crafts related to what they are learning. They did the letter a for apple, lecture time: where they learned about bugs. End of the day activity: playing with the parachute and sharing with his friends. Lunch: optional"
                                value={activities}
                                onChange={(e) => setActivities(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br></br>
                        <Button className="button-space" variant="primary" type="submit" disabled={submitting} size="sm">
                            {submitting ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                        <Button className="button-space" variant="secondary" onClick={handlePreviousVariablesDailyReport} disabled={submittingPreviousVariables} size="sm" >

                            {submittingPreviousVariables ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Previous Variables"
                            )}
                        </Button>
                        <Button variant="light" onClick={() => handleCleanForm('daily_report')} size="sm" >
                            Clean
                        </Button>

                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showGoal} onHide={handleCloseGoal}>
                <Modal.Header closeButton>
                    <Modal.Title>Report Goal</Modal.Title>
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
                    <Form onSubmit={handleSubmitGoal}>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={handleConfirm}
                            />
                        </Form.Group>

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
                                {childs.map((child) => (
                                    <option key={child._id} value={child._id}>
                                        {child.child_name}
                                    </option>
                                ))}
                            </Form.Control>
                            <Button variant="link" onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Add Child'}</Button>

                        </Form.Group>
                        <Form.Group controlId="age">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="goals">
                            <Form.Label>Goals</Form.Label>
                            <FormControl
                                as="textarea"
                                className="custom-textarea-long"
                                placeholder="Example: Improve verbal communication using her words to express feelings and her needs"
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
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
                        <Button className="button-space" variant="secondary" onClick={handlePreviousGoal} disabled={submittingPreviousVariables} size="sm">
                            {submittingPreviousVariables ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Previous Variables"
                            )}
                        </Button>
                        <Button variant="light" onClick={() => handleCleanForm('goal_report')} size="sm" >
                            Clean
                        </Button>

                    </Form>
                </Modal.Body>
            </Modal>
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
                                as="textarea"
                                className="custom-textarea-long"
                                value={description}
                                placeholder="Example: Children were engaged during the group time by choosing the letter they wanted to learn during the week. Children enjoyed singing five little monkeys swinging on the tree. Children enjoyed developing arts and crafts about letters and they remember easily what word start whit the letter, in this case P for piggy.Some parents are worried about their child emotional manage because they mention they do not know how to manage it, because the children do not have self-regulation. Many children need to improve their help-self skills"
                                onChange={(e) => setDescription(e.target.value)}
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
            <Modal show={showFormWeeklyReflection} onHide={handleCloseFormWeeklyReflection}>
                <Modal.Header closeButton>
                    <Modal.Title>Weekly Critical Reflection</Modal.Title>
                </Modal.Header>
                {alertVisible && (
                    <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <Modal.Body>
                    <Form onSubmit={handleSubmitWeeklyReflection}>
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
                            <Form.Label>Describe weekly reflection</Form.Label>
                            <Form.Control
                                as="textarea"
                                className="custom-textarea-long"
                                value={description_reflection}
                                placeholder="Example: Children were engaged during the group time by choosing the letter they wanted to learn during the week. Children enjoyed singing five little monkeys swinging on the tree. Children enjoyed developing arts and crafts about letters and they remember easily what word start whit the letter, in this case P for piggy. Some parents are worried about their child emotional manage because they mention they do not know how to manage it, because the children do not have self-regulation. Many children need to improve their help-self skills"
                                onChange={(e) => setDescriptionReflection(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br></br>


                        <br />
                        <Button className="button-space" variant="primary" type="submit" disabled={submitting} size="sm" >
                            {submitting ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                        <Button className="button-space" variant="secondary" onClick={handlePreviousWeeklyReflection} disabled={submittingPreviousVariables} size="sm" >
                            {submittingPreviousVariables ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Previous Variables"
                            )}
                        </Button>
                        <Button variant="light" onClick={() => handleCleanForm('weekly_reflection')} size="sm" >
                            Clean
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showFormWeeklyPlanning} onHide={handleCloseFormWeeklyPlanning}>
                <Modal.Header closeButton>
                    <Modal.Title>Weekly Planning</Modal.Title>
                </Modal.Header>
                {alertVisible && (
                    <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <Modal.Body>
                    <Form onSubmit={handleSubmitWeeklyPlanning}>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={handleConfirm}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="age">
                            <Form.Label>Range Age</Form.Label>
                            <Form.Control
                                type="textarea"
                                value={rangeAge}
                                placeholder="Example: 1-2"
                                onChange={(e) => setRangeAgePlanning(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Goals</Form.Label>
                            <Form.Control
                                as="textarea"
                                className="custom-textarea-long"
                                value={descriptionPlanning}
                                placeholder="Example: Carry out activities in the outdoor area that allow children to enjoy Easter time"
                                onChange={(e) => setDescriptionPlanning(e.target.value)}
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
                        <Button className="button-space" variant="secondary" onClick={handlePreviousWeeklyPlanning} disabled={submittingPreviousVariables} size="sm">
                            {submittingPreviousVariables ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Previous Variables"
                            )}
                        </Button>
                        <Button variant="light" onClick={() => handleCleanForm('weeklyn_planning')} size="sm" >
                            Clean
                        </Button>

                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showFollowUp} onHide={handleCloseFollowUp}>
                <Modal.Header closeButton>
                    <Modal.Title>Follow up</Modal.Title>
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
                    <Form onSubmit={handleSubmitFollowUp}>
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
                                {childs.map((child) => (
                                    <option key={child._id} value={child._id}>
                                        {child.child_name}
                                    </option>
                                ))}
                            </Form.Control>
                            <Button variant="link" onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Add Child'}</Button>

                        </Form.Group>

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
                                as="textarea"
                                className="custom-textarea-small"
                                placeholder="Example: To assist Jasper in developing his fine motor skills"
                                value={goalFollowUp}
                                onChange={(e) => setGoalFollowUp(e.target.value)}
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
                                value={descriptionsFollowUp}
                                onChange={(e) => setDescriptionsFollowUp(e.target.value)}
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
                        <Button className="button-space" variant="secondary" onClick={handlePreviousFollowUp} disabled={submittingPreviousVariables} size="sm">
                            {submittingPreviousVariables ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Previous Variables"
                            )}
                        </Button>
                        <Button variant="light" onClick={() => handleCleanForm('follow_up')} size="sm" >
                            Clean
                        </Button>

                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showSummativeAssessment} onHide={handleCloseSummativeAssessment}>

                <Modal.Header closeButton>
                    <Modal.Title>Summative Assessment</Modal.Title>
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
                    <Form onSubmit={handleSubmitSummativeAssessment} >
                        <Row>
                            <Col>
                                <Form.Group controlId="date">
                                    <Form.Label>Date</Form.Label>
                                    <DatePicker
                                        className="form-control"
                                        selected={date}
                                        onChange={handleConfirm}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <FormGroup controlId="buttonAddChild">
                                    <Form.Label><br></br></Form.Label><br></br>
                                    <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Add Child'}</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>
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
                            </Col>
                            <Col>
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
                            </Col>
                        </Row>
                        <br />
                        <Form.Group controlId="outcome1">
                            <Form.Label>Outcome1 Children have a strong sense of identity:</Form.Label>
                            <FormControl
                                as="textarea"
                                className="custom-textarea-size"
                                placeholder="Example: Children have a strong sense of identity: they prefer to play and be alone, they look for their teachers when they are afraid, they participate in reading groups, they know what they want, they are whimsical"
                                value={outCome1}
                                onChange={(e) => setOutCome1(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="outcome2">
                            <Form.Label>Outcome2 Children are connected with and contribute to their world:</Form.Label>
                            <FormControl
                                as="textarea"
                                className="custom-textarea-size"
                                placeholder="Example:Children are connected with and contribute to their world: he is kind, he is not aggressive, he respects others"
                                value={outCome2}
                                onChange={(e) => setOutCome2(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="outcome3">
                            <Form.Label>Outcome3 Children have a strong sense of wellbeing:</Form.Label>
                            <FormControl
                                as="textarea"
                                className="custom-textarea"
                                placeholder="Example:Children have a strong sense of wellbeing: they do not like to wear the hat or the suncream when they go out, it is difficult to start the toilet training process because they refuse to sit down despite the fact that the educators create different strategies"
                                value={outCome3}
                                onChange={(e) => setOutCome3(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="outcome4">
                            <Form.Label>Outcome4 Children are confident and involved learners:</Form.Label>
                            <FormControl
                                as="textarea"
                                className="custom-textarea-size"
                                placeholder="Example:Children are confident and involved learners: chooses what they want to learn, answers correctly when they feel confident, during art and craft activities is drawn to activities where markers are used, likes reading sections and looks for books to look at"
                                value={outCome4}
                                onChange={(e) => setOutCome4(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="outcome5">
                            <Form.Label>Outcome5 Children are effective communicators:</Form.Label>
                            <FormControl
                                as="textarea"
                                className="custom-textarea-size"
                                placeholder="Example:Children are effective communicators: he is shy when talking to other friends or teachers despite having good verbal skills, he prefers non-verbal communication"
                                value={outCome5}
                                onChange={(e) => setOutCome5(e.target.value)}
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
                        <Button className="button-space" variant="secondary" onClick={handlePreviousSummativeAssessment} disabled={submittingPreviousVariables} size="sm" >
                            {submittingPreviousVariables ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Previous Variables"
                            )}
                        </Button>
                        <Button variant="light" onClick={() => handleCleanForm('summative_assessment')} size="sm" >
                            Clean
                        </Button>

                    </Form>
                </Modal.Body>
            </Modal>
            
            <br></br>
            <br></br>
            <div className="cardModern">
            <div className="item item--3">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--3">Daily Journal</span>
                    <div className="body-card">
                        <span className="text text--1">Description of the activities carried out during the day.</span>
                        <br></br>
                    </div>
                    <div className="footer-card">
                        <button className="buttonCard3" onClick={handleCreateClick}><span>Create </span></button>
                        <button className="buttonCard3" onClick={() => handleHistoricalReportSubmission('daily_report')}><span>Historical</span></button>

                        <button className="buttonCard3" onClick={() => handleShowTutorial("https://www.youtube.com/embed/7NAye9JbfJE?si=bPi-l7aYMjrf0uSN")} variant="info"><span>Tutorial </span></button>

                    </div>
                </div>
                
                <div className="item item--3">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--3">Goal</span>

                    <div className="body-card">
                        <span className="text text--1">Identifying the areas of development that need focus and setting precise goals.</span>
                        <br></br>
                    </div>
                    <div className="footer-card">
                        <button className={`buttonCard3 ${!fullAccess ? "link-disabled" : ""}`} onClick={handleShowGoal}><span>Create </span></button>
                        <button className={`buttonCard3 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleHistoricalReportSubmission('goal_report')}><span>Historical</span></button>

                        <button className={`buttonCard3 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/vBXdNYX_mJ8?si=n_qAFdWSryGlJyB4")} variant="info"><span>Tutorial </span></button>

                    </div>

                </div>

                <div className="item item--3">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--3">Ask me anything (Chat)</span>
                    <div className="body-card">
                        <span className="text text--1">Have a concern? Get the information you require by starting a discussion.</span>
                        <br></br>
                    </div>
                    <div className="footer-card">
                        {/* <Link to="/chat" className={!fullAccess ? "link-disabled" : ""}> */}
                        <Link to="/chat">
                            <button className={`buttonCard3 ${!fullAccess ? "link-disabled" : ""}`} ><span>Ask me anything (Chat)</span></button>
                        </Link>
                    </div>
                </div>

                <div className="item item--1">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--1">Observations</span>
                    <div className="body-card">
                        <span className="text text--1">Analysis of skills based on activity descriptions.</span>
                        <br></br>
                        <br></br>
                        <br></br>
                    </div>
                    <div className="footer-card">
                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={handleShowObservations} ><span>Create </span></button>
                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleHistoricalReportSubmission('descriptions_report')}><span>Historical</span></button>

                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/Ws2e4MohNzE?si=rfaMffp628OLDuv1")} variant="info"><span>Tutorial </span></button>

                    </div>
                </div>

                <div className="item item--1">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--1">Follow up</span>
                    <div className="body-card">
                        <span className="text text--1">Analysis of skills based on activity descriptions.</span>
                        <br></br>
                        <br></br>
                        <br></br>
                    </div>

                    <div className="footer-card">
                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={handleShowFollowUp}><span>Create </span></button>
                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleHistoricalReportSubmission('follow_up')}><span>Historical</span></button>
                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/o_0ADz4yP28?si=y6IYQRhxs8-kKsv6")} variant="info"><span>Tutorial </span></button>
                    </div>
                </div>

                <div className="item item--1">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--1">Summative Assessment</span>
                    <div className="body-card">
                        <span className="text text--1">A measurement of a child's development and achievement in reference to predetermined learning standards.</span>
                        
                    </div>
                    <div className="footer-card">
                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={handleShowSummativeAssessment}><span>Create </span></button>
                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleHistoricalReportSubmission('summative_assessment')}><span>Historical</span></button>
                        <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/FofvjvST65I?si=Y89Oz6CFQuXX3Wy7")}><span>Tutorial </span></button>
                    </div>
                    

                </div>
                <div className="item item--2">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--2">Daily reflection</span>
                    <div className="body-card">
                        <span className="text text--1">Assessing how well the kids are learning and identifying what needs extra support.</span>
                        <br></br>
                    </div>
                    <div className="footer-card">
                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={handleShowFormReflection}><span>Create </span></button>
                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleHistoricalReportSubmission('critical_reflection')}><span>Historical</span></button>

                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/zad3bDnjsII?si=xz8vXrZzwduvxFlR")} variant="info"><span>Tutorial </span></button>

                    </div>
                </div>

                
               
               

                <div className="item item--2">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--2">Weekly critical reflection</span>
                    <div className="body-card">
                        <span className="text text--1">Planning age-appropriate activities that assist children's development requires structure and consistency.</span>
                    </div>
                    <div className="footer-card">
                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={handleShowFormWeeklyReflection}><span>Create </span></button>
                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleSelectReportReflectionSubmission('critical_reflection')}><span>By days</span></button>

                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleHistoricalReportSubmission('weekly_reflection')}><span>Historical</span></button>
                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/zad3bDnjsII?si=xz8vXrZzwduvxFlR")} variant="info"><span>Tutorial </span></button>
                    </div>
                </div>
                
                
               
                
               

                <div className="item item--2">
                    <svg> {/* Tu SVG aquí */} </svg>
                    <span className="text title--2">Weekly Planning</span>
                    <div className="body-card">
                        <span className="text text--1">Activities for weekly planning are created by aim.</span>
                        <br></br>
                    </div>
                    <div className="footer-card">
                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={handleShowFormWeeklyPlanning}><span>Create </span></button>
                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleHistoricalReportSubmission('weeklyn_planning')}><span>Historical</span></button>
                        <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/-dkItdfDZho?si=ji4wWK_wdGzMmCK5")} variant="info"><span>Tutorial </span></button>
                    </div>

                </div>
                
                {/* Puedes agregar más tarjetas siguiendo la misma estructura */}
                
            </div>
            
               



        </div>

    );

};

export default Home;