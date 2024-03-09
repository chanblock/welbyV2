import React, {useState,useEffect}from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import styles from '../../styles/ReportList.module.css';
import {Button, Modal, Spinner,Form,Col } from 'react-bootstrap';
import "../../styles/Home.css";
import { submitGetHistoricalReport,submitCreateWord } from '../../api';
const ReportList = () => {
    const location = useLocation();
    const reports = location.state?.reports || [];
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
      
   

    const filteredReports = reports.filter(report => {
        const childName = report.child && report.child.child_name;
        const isNotAvailable = value => value === "Not available";
        return isNotAvailable(childName) || (filter.trim() === '' || (childName && childName.toLowerCase().includes(filter.toLowerCase())));
    });
      
    const handleRedirect = (title,type_report, timestamp, report, name, age, goalObservations) => {
        navigate("/get_historical_report", { state: { title, type_report, timestamp, report,name,age,goalObservations } });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGetReport = async (token) =>{
        try {
            
            const data = await submitGetHistoricalReport(token);
            
            if (data.error) {
                console.log(data.error)
            } else {
                const {
                    get_report: {
                        type_report,
                        timestamp,
                        report,
                        name = "Not available",
                        age = "Not available",
                        goalObservations = "Not available",
                    }
                } = data;

                handleRedirect('Historical Report', type_report, timestamp, report, name, age, goalObservations);
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
                <h1>Historical {reports.length > 0 ? formatTitle(reports[0].type_report) : 'No reports available'}</h1>
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
            <div className={styles['report-list-container']}>
                { filteredReports.length === 0 ? (
                <p className="display-6">No results found</p>
                ) : (
                filteredReports.map((report, index) => {
                        const {
                            _id,
                            report: reportContent,
                            timestamp,
                            child: { child_name = "Not available" } = {},
                            age = "Not available",
                            goalObservations = "Not available",
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
                                    {reports[0].type_report === "descriptions_report" && (
                                        <><em>Name:</em><strong> {child_name}</strong><br></br><em>Observations:</em>{goalObservations}</> 
                                    )}
                                    <br></br>
                                <em>Report:</em> {truncateReport(reportContent)}</p>
                                <button onClick={() => handleGetReport(_id)} className="mt-2 d-none d-md-inline-block">Show more</button>
                                <button onClick={() => handleGetReport(_id)} className="mt-2 ml-2 d-inline-block d-md-none">Show more</button>
                            </div>
                        );
                    }))}
              
         

            </div>

        </div>
    );
};

export default ReportList;
