import React, { useState } from "react";
import "../styles/ContactUs.css";
import { Spinner } from "react-bootstrap";
import { submitSendEmailContactUs} from '../api/user';



const ContactUs = () =>{
    const [isSubmitting, SetIsSubmintting] = useState(false);
    const [formData, setFormData]= useState({
        first_name : '',
        last_name : '',
        phone : '',
        email : '',
        message : ''
        
    });
    const handleInputChange = (e) =>{
        const {name, value} = e.target;
        setFormData({...formData, [name]:value});
    }

    const handleSubmitContact =async(e) =>{
        e.preventDefault();
        SetIsSubmintting(true);
        try {
            const response = await submitSendEmailContactUs(formData);
            setFormData({
                first_name : '',
                last_name : '',
                phone : '',
                email : '',
                message : ''
            });
            SetIsSubmintting(false);
            // Verificar si la respuesta del backend fue exitosa
            if (response.message) {
                
                alert("Email sent successfully"); // Mostrar alerta de éxito
            } else if (response.error) {
               
                alert("Email cannot be sent"); // Mostrar alerta de error
            }

        } catch (error) {
            SetIsSubmintting(false);
            alert("Email cannot be sent"); // Mostrar alerta de error
            throw error;
        }
    }
    return(
        <div className="contact-us-container">
            <div className="container-fluid ">
            <div className="row ">
                    <div className="col-md-6 col-sm-12">
                        <div className="col-md-12 col-sm-12 text-center">
                            <img src={process.env.PUBLIC_URL + '/img/contactUs.png'} alt="Descripción de la imagen" style={{ maxWidth: '65%', height: 'auto', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                        </div>

                        <div id="info-contact" className="col-md-12 col-sm-12">
                            <p><img src={process.env.PUBLIC_URL + '/svg/call.svg'} alt="Teléfono" /> 0415281575</p>
                            <p><img src={process.env.PUBLIC_URL + '/svg/mail.svg'} alt="Email" /> welby.info@gmail.com</p>
                            <p><img src={process.env.PUBLIC_URL + '/svg/whatsapp.svg'} alt="whatsapp" />
                                <a href="https://chat.whatsapp.com/C8YwzBPeBAkFGRQ6uFTTOV" target="_blank" rel="noopener noreferrer" className="dark-link">
                                    WhatsApp
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className="contact-form">
                        <span className="heading text-center">Contact Us</span>
                        <div className="container form-style">
                        <form onSubmit={handleSubmitContact}>
                            <label htmlFor="first_name">First Name*:</label>
                            <input type="text" id="first_name" name="first_name" required value={formData.first_name} onChange={handleInputChange}/>
                            <label htmlFor="last_name">Last Name:</label>
                            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange}/>
                            <label htmlFor="phone">Phone*:</label>
                            <input type="text" id="phone" name="phone"  value={formData.phone} onChange={handleInputChange}/>
                            <label htmlFor="email">Email*:</label>
                            <input type="email" id="email" name="email" required  value={formData.email} onChange={handleInputChange}/>

                            <label htmlFor="message">Message*:</label>
                            <textarea id="message" name="message" required value={formData.message} onChange={handleInputChange}></textarea>
                            <button type="submit" disabled={isSubmitting} >
                            {isSubmitting ? (
                                <>
                                    Sending...
                                    <Spinner animation="border" size="sm" />
                                </>
                            ) : (
                                'Send'
                            )}
                        </button>

                        </form>
                        </div>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;