import React, {useState,useEffect}from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import styles from '../../styles/ReportList.module.css';
import {Button, Modal, Spinner,Form,Col } from 'react-bootstrap';
import "../../styles/Home.css";
import { submitGetHistoricalReport,submitCreateWord,deleteReport,submitHistoricalReport } from '../../api';
import { useReports} from "../../context/ReportContext";

const ReportList = () => {
    const location = useLocation();
    // const reports = location.state?.reports || [];
    const { reports, setReports } = useReports();
    useEffect(() => {
        // Función para obtener los reportes
        const fetchReports = async () => {
            if (reports.length === 0) {
                try {
                    const token = localStorage.getItem("token");
                    const typeReport = localStorage.getItem("typeReport");
                    const data = await submitHistoricalReport(token, typeReport);
                    // Filtrar los reportes con el mismo 'typeReport'
                    const filteredReports = data.list_report.filter(report => report.type_report === typeReport);
                    // Establecer los reportes en el contexto
                    setReports(filteredReports);
                } catch (error) {
                    console.error(error);
                    // Aquí puedes mostrar un mensaje de error al usuario si lo deseas
                }
            }
        };

        // Invocar la función
        fetchReports();
    }, []);
    const sortedReports = reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const [filter, setFilter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    // const modal alert
    const [showModal, setShowModal] = useState(false);
    const [messageModal, setMessageModal] = useState("");
    const [linkModal, setLinkModal] = useState(null);
    // Add state to hold selected report ids
    const [selectedReports, setSelectedReports] = useState([]);

    
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setShowModal(false);
      };

    const handleShowModal = (messageModal, linkModal = "") => {
        setSubmitting(false);
        setMessageModal(messageModal);
        setLinkModal(linkModal); // Save the link
        
        setShowModal(true);
      };
 
    const truncateReport = (report) => {
        const lines = report.split('\n');
        return lines.slice(0, 10).join('\n');
    };

    const formatTitle = (title) => {
        return title
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleFilterChange = (event) => {
        const inputValue = event.target.value.trim();
        setFilter(event.target.value);
      };
      
 

    const filteredReports = sortedReports.filter(report => {
        const childName = report.child && report.child.child_name;
        const isNotAvailable = value => value === "Not available";
        return isNotAvailable(childName) || (filter.trim() === '' || (childName && childName.toLowerCase().includes(filter.toLowerCase())));
    });
 
    const handleRedirect = (title,type_report, timestamp, report, name, age, goalObservations) => {
        navigate("/get_historical_report", { state: { title, type_report, timestamp, report,name,age,goalObservations } });
    };

    const handleGoBack = () => {
        navigate("/home");
    };

    const handleGetReport = async (token) =>{
        try {
            
            const data = await submitGetHistoricalReport(token);
            
            if (data.error) {
                console.log(data.error)
            } else {

                console.log("data",data)
                const {
                    get_report: {
                        type_report,
                        timestamp,
                        response_chatgpt: reportContent= "Not available",
                        variables: {name: child_name = "Not available",goal_observations: goalObservations = "Not available" } = {},
                        age = "Not available",
                        
                    }
                } = data;

                handleRedirect('Historical Report', type_report, timestamp, reportContent, child_name, age, goalObservations);
                // handleRedirect('Historical Report', data['get_report']['type_report'],data['get_report']['timestamp'],data['get_report']['report']);
            }
        } catch (error) {
            console.error(error);
          
        }
    } 

    const handleDeleteReport = async(reportId) =>{
        try {
            const deletedReport = await deleteReport(reportId);
            if (deletedReport.error) {
                console.log(deletedReport.error)
            } else {
                console.log("deletedReport",deletedReport)
                 // Actualizar la lista de reportes
                const updatedReports = reports.filter(report => report._id !== reportId);
                navigate(location.pathname, { state: { reports: updatedReports } });
                // Mostrar un mensaje informativo
                handleShowModal("Report deleted successfully!");
                // handleRedirect('Historical Report', data['get_report']['type_report'],data['get_report']['timestamp'],data['get_report']['report']);
            }
        } catch (error) {
            console.error(error);
          
        }
    }

     // Function to handle checkbox click
    const handleCheckboxChange = (_id, isChecked) => {
        if (isChecked) {
            // If the checkbox is checked, add the id to the array
            setSelectedReports(prev => [...prev, _id]);
        } else {
            // If the checkbox is unchecked, remove the id from the array
            setSelectedReports(prev => prev.filter(id => id !== _id));
        }
    };

    useEffect(() => {
    }, [selectedReports]);

    const handleCreateWord = async() => {
        if (selectedReports.length === 0) {
            alert("Please select at least one report.");
            return;
        }

        const token = localStorage.getItem('token');
        setSubmitting(true);
        const data = await submitCreateWord(token, selectedReports);
        setSubmitting(false);
        if (data.error) {
            alert(data.error);
        } else {
           
            handleShowModal("Link to download report:", data.message);
        }
    };

    function getReportTitle(reports) {
        if (reports.length === 0) {
            return 'No reports available';
        }
    
        switch (reports[0].type_report) {
            case "daily_report":
                return "Daily Journal";
            case "weekly_reflection":
                return "Weekly critical reflection";
            case "critical_reflection":
                return "Daily reflection";
            default:
                return formatTitle(reports[0].type_report);
        }
    }
    return (
        <div>
            <br></br>
            <Modal show={showModal} onHide={handleCloseModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Hi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {messageModal}
                    <div className='row'>
                    {linkModal && <a href={linkModal} target="_blank" rel="noopener noreferrer">{linkModal}</a>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                    </Button>
                    
                </Modal.Footer>
            </Modal>

           <div className={styles['title']}>
                {/* <h1>Historical  {reports.length > 0 ? formatTitle(reports[0].type_report) : ''}</h1> */}
                {/* <h1>Historical  {reports.length > 0 ? formatTitle(reports[0].type_report) : 'No reports available'} </h1> */}
                <h1>
                    Historical &nbsp;  
                    {getReportTitle(reports)}
                    </h1>

            </div>
            <Col  className="d-flex justify-content-center">
           
                <div className={styles['btn-container']}>
               
                    <Button onClick={handleGoBack} variant="outline-secondary" >Go Back</Button>{' '}
                    {reports.length > 0 && reports[0].type_report === "descriptions_report" && (	
                    <Button variant="outline-primary" onClick={handleCreateWord} disabled={submitting} >
                                    {submitting ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        "Create Word"
                                    )}
                    </Button>
                    )}
                </div>
            </Col>
          <br></br>
            {reports.length > 0 && reports[0].type_report === "descriptions_report" && (	
                <div className={styles['search-bar']}>
                    <input
                    type="text"
                    placeholder="Search by name"
                    value={filter}
                    onChange={handleFilterChange}
                    className={styles['search-input']}
                    />
                </div>
            )}

            <div className={styles["fullscreen-minheight-div"]}>
                <div className={styles['report-list-container']}>
                    { filteredReports.length === 0 ? (
                        
                    <><p className="display-6"> <br></br>No results found 
                        </p>
                        <p className="display-6"> We are sorry for the inconvenience, please go back to reload the page home
                            </p></>
                    ) : (
                    filteredReports.map((report, index) => {
                            const {
                                _id,
                                response_chatgpt: reportContent= "Not available",
                                timestamp,
                                variables: {name: child_name = "Not available",goal_observations: goalObservations = "Not available" } = {},
                                age = "Not available",
                            
                            } = report;
                            
                            return (
                                <div key={index} className={styles['report-item']}>
                                    
                                    {reports[0].type_report === "descriptions_report" && (
                                        <div className={styles['checkbox-container']} >
                                        <Form.Check
                                        type="checkbox"
                                        id={`report-checkbox-${index}`}
                                        className={styles['report-checkbox']}
                                        onChange={(e) => handleCheckboxChange(_id, e.target.checked)}
                                    />
                                        </div>
                                    )}  
                                    <h3><p className="display-6"><em>{new Date(timestamp).toLocaleString()}</em></p></h3>
                                    <p>
                                
                                    { 
                                        ["descriptions_report", "follow_up", "summative_assessment", "goal_report"].includes(reports[0].type_report) && (
                                            <>
                                                <em>Name:</em><strong> {child_name}</strong><br/>
                                                {reports[0].type_report === "descriptions_report" && <><em>Observations:</em>{goalObservations}<br/></>}
                                                {/* Puedes agregar más condiciones para otros tipos de reportes aquí si es necesario */}
                                            </>
                                        )
                                    }
                                    <em>Report: </em> {truncateReport(reportContent)}</p>
                                
                                    <div className='row' style={{ justifyContent: 'flex-start' }}>
                                        <div style={{ display: 'inline-block' }}>
                                            <button onClick={() => handleGetReport(_id)} className="btn-sm mt-2 d-none d-md-inline-block button-space">Show more</button>
                                            <button onClick={() => handleDeleteReport(_id)} style={{ backgroundColor: '#8c8585', color: '#ffffff' }} className="btn-sm mt-2 ml-2 d-none d-md-inline-block ">Delete Report</button>
                                        </div>
                                    
                                            <button onClick={() => handleGetReport(_id)} className="btn-sm mt-2 ml-2 d-inline-block d-md-none">Show more</button>
                                            <button onClick={() => handleDeleteReport(_id)} style={{ backgroundColor: '#8c8585', color: '#ffffff' }} className="btn-sm mt-2 ml-2 d-inline-block d-md-none ">Delete Report</button>
                                    
                                    </div>

                                    
                                </div>
                            );
                        }))}
                
            

                </div>
            </div>
        </div>
    );
};

export default ReportList;
