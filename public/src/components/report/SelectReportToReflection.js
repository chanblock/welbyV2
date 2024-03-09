import React, { useState }  from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import styles from '../../styles/ReportList.module.css';
import {Button, Row,Col,Form, Spinner, Alert } from 'react-bootstrap';
import "../../styles/Home.css";
import {  submitWeeklyReflectionByDays } from '../../api';

const SelectReportToReflection = () => {
    const location = useLocation();
    // const reports = location.state?.reports?.list_report || [];
    const reports = location.state?.reports || [];
    const [submitting, setSubmitting] = useState(false);
    const [selectedReports, setSelectedReports] = useState([]);

    //  const to alert
     const [alertVisible, setAlertVisible] = useState(false);
     const [alertMessage, setAlertMessage] = useState("");

    // const to filter time
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
 
     const showAlert = (message) => {
         setAlertMessage(message);
         setAlertVisible(true);
         setTimeout(() => {
             setAlertVisible(false);
         }, 5000);
     };
 
  
    const handleCheckboxChange = (e, reportId) => {
        if (e.target.checked) {
            setSelectedReports([...selectedReports, reportId]);
        } else {
            setSelectedReports(selectedReports.filter(id => id !== reportId));
        }
    };

    // const filteredReports = reports.filter((report) => {
    //     const reportDate = new Date(report.variables.date);
    //     if (startDate && endDate) {
    //       const start = new Date(startDate);
    //       const end = new Date(endDate);
    //       return reportDate >= start && reportDate <= end;
    //     }
    //     return true;
    //   });
     
    const filteredReports = reports.filter((report) => {
        const reportDate = new Date(report.variables.date);
    
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          return reportDate >= start && reportDate <= end;
        }
        return true;
    });
    
    const sortedFilteredReports = filteredReports.sort((a, b) => {
        const dateA = new Date(a.variables.date);
        const dateB = new Date(b.variables.date);
        return dateB - dateA;  // This will sort from the most recent to the oldest date
    });

    const formatTitle = (title) => {
        return title
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    // const report view
    const navigate = useNavigate();
    const handleRedirect= (reportData)=>{
        navigate("/report",{state: {reportData}});
    }
   

    const handleGoBack = () => {
        navigate(-1);
    };
 
    const handleCreateReflection = async() => {
         // Check if there is at least one selected report
        if (selectedReports.length === 0) {
            showAlert("Please select at least one report.");
            return;
        }

        const token = localStorage.getItem('token');
        // Do something with the selectedReports, e.g., send them to the server
        
        setSubmitting(true);
    
        try {
            const data = await submitWeeklyReflectionByDays(token,selectedReports);
            setSubmitting(false);
            if (data.error) {
                showAlert("Error");
            } else {
                setSubmitting(false);
                const reportData = {
                    title: 'Weekly Reflection',
                    content: data['response']['message'],
                    report_id:data['response']['report_id'],
                 
                };
                handleRedirect(reportData)
            }
        } catch (error) {
            console.error(error);
            // showAlert("Failed to send report. Please try again later.");
            // setSubmitting(false);
        }

    };
    return (
        <div  className='container'>
            <br></br>
           <div className={styles['title']}>
                <h1>Select {reports.length > 0 ? formatTitle(reports[0].type_report) : ''}</h1>
            </div>
            <Row>
            <Col></Col>
            <Col  className="d-flex justify-content-center">
                
            <div className={styles['btn-container']}>
                <Button onClick={handleGoBack} variant="outline-secondary" >Go Back</Button>{' '}
                <Button variant="outline-primary" onClick={handleCreateReflection} disabled={submitting} >
                                {submitting ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    "Create reflection"
                                )}
                </Button>
            </div>
            </Col>
            <Col></Col>
            
            </Row>
            <Row className={styles['report-list-container']}>
            {alertVisible && (
                    <Alert variant="danger" onClose={() => setAlertVisible(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <h4 style={{marginBottom: "0px"}}>
                        Select date range:
                </h4>

                <Col>
                
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    />
                </Col>
                <Col>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    />
                </Col>
            </Row>

            <div className={styles['report-list-container']}>
                {/* {filteredReports.map((report, index) => ( */}
                {sortedFilteredReports.map((report, index) => (

                    <div key={index} className={styles['report-item']}>
                        <div className={styles['checkbox-container']} >
                            <Form.Check
                                type="checkbox"
                                id={`report-checkbox-${index}`}
                                className={styles['report-checkbox']}
                                onChange={(e) => handleCheckboxChange(e, report._id)}
                            />
                        </div>
                        
                        <div className={styles['report-text']}>
                            <h3><p className="display-6"><em>{new Date(report.variables.date).toLocaleString()}</em></p></h3>
                            <p>Description: {report.variables.description}</p>
                        </div>
                        
                    </div>
                ))}
            </div>

        </div>
    );
};

export default SelectReportToReflection;
