import React, { useState, useRef  } from 'react';
import '../styles/Card.css';  
import '../styles/Welcome.css';  
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from "react-router-dom";
import { Row, Col} from "react-bootstrap";
import testimonio1 from '../../src/videos/testimonio1.mp4';
import testimonio2 from '../../src/videos/testimonio2.mp4';
import testimonio3 from '../../src/videos/testimonio3.mp4'

import { sendAudio } from '../api/speech2text';

function Card({ title, description, price, benefits, link }) {
  const navigate = useNavigate();


  return (

    <div className="card">
      <h3 className="card-title1">{title}</h3>
      <p className="card-description">{description}</p>
      <p className="card-price">{price}</p>
      <ul className="card-benefits">
        {benefits.map((benefit, index) => (
          <li key={index} className={benefit.isIncluded ? 'included' : 'not-included'}>
            <strong>{benefit.highlight}</strong> {benefit.content}
          </li>
        ))}
      </ul>

      <Button variant="outline-success" onClick={() => navigate('/subscribe', { state: { title, price } })}>
        Suscríbete a {title}
      </Button>
    </div>
  );
}



export default function Welcome() {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [videoVisible, setVideoVisible] = React.useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleRegister = () => {
    let title = "Free trial";
    let price = '$0/month then $24';

    navigate('/subscribe', { state: { title, price } })
  }

  
  const cardsData = [
    // Aquí irían los datos de tus tarjetas
    {
      title: 'Free trial',
      description: 'Get two months free by registering',
      price: '$0/month then $24',
      benefits: [
        {
          content: '',
          highlight: '\u2713 Exclusive access to the Daily Journal report.',
          isIncluded: true,
        },
        {
          content: 'Unlimited access to the different types of reports and access to them at any time',
          highlight: 'Child Care Expert :',
          isIncluded: false,
        },
        {
          content: 'access to a real-time artificial intelligence chat channel',
          highlight: 'Ask me anything (Chat):',
          isIncluded: false,
        },
        {
          content: 'You will receive specialized and personalized advice, adapted to the daily challenges of child care.',
          highlight: 'Personalized advice:',
          isIncluded: false,
        }

      ],
      link: '/auth',
    },
    {
      title: 'Basic',
      description: 'Monthly payment with automatic renewal every month',
      price: '$24/month',
      benefits: [

        {
          content: 'Unlimited access to the different types of reports and access to them at any time',
          highlight: '\u2713 Child Care Expert :',
          isIncluded: true,
        },
        {
          content: 'access to a real-time artificial intelligence chat channel',
          highlight: '\u2713 Ask me anything (Chat):',
          isIncluded: true,
        },
        {
          content: 'You will receive specialized and personalized advice, adapted to the daily challenges of child care.',
          highlight: 'Personalized advice:',
          isIncluded: false,
        }

      ],
      link: '/register-basic',
    },
    {
      title: 'Premium',
      description: 'Monthly payment with automatic renewal every year',
      price: '$264/year',
      benefits: [

        {
          content: 'Unlimited access to the different types of reports and access to them at any time',
          highlight: '\u2713 Child Care Expert :',
          isIncluded: true,
        },
        {
          content: 'access to a real-time artificial intelligence chat channel',
          highlight: '\u2713 Ask me anything (Chat):',
          isIncluded: true,
        },
        {
          content: 'You will receive specialized and personalized advice, adapted to the daily challenges of child care.',
          highlight: '\u2713 Personalized advice:',
          isIncluded: true,
        }

      ],
      link: '/register-basic',
    }
  ];

  const handleVideoTestimonial = (testimonial) => {
    setVideoUrl(testimonial);
    setVideoVisible(!videoVisible);
  }
  const handleCloseModal = () => {
    setVideoVisible(false);
  };

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const startRecording = async () => {
    // Comprueba si los medios de grabación están disponibles
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Solicita acceso al micrófono
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Crea un nuevo MediaRecorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        // Recolecta los datos de audio cuando estén disponibles
        const audioChunks = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        // Cuando la grabación se detenga, convierte el audio a un objeto URL y guarda el URL
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        };
        
        // Comienza la grabación
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error al acceder al micrófono:', err);
      }
    } else {
      alert('La grabación de audio no es compatible con este navegador.');
    }
  };

  const stopRecording = () => {
    // Detiene la grabación
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    // Cierra el stream del micrófono para liberar recursos
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
  };

  return (

    <div className="home-container">
      <br></br>
      <section className="intro-section ">
        <h1 className="display-1">
          <img src={process.env.PUBLIC_URL + '/logoWelby3.png'} alt="Welly Logo" />
        </h1>
        <br/>
        <p className="lead " >Introducing Welby, a revolutionary tool meticulously crafted to streamline the daily responsibilities of child care professionals. Leveraging state-of-the-art artificial intelligence technology, this innovative system provides services custom-tailored to alleviate your workload,
          enabling you to channel your energy where it matters most: nurturing and caring for the children.</p>
        <br/>
        <button className="button" onClick={handleRegister}>Sign up for Free</button>
        <div>
          <button className="button-microphone" onClick={isRecording ? stopRecording : startRecording}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="svg-icon">
              <g strokeWidth="2" strokeLinecap="round" stroke="#ff342b">
                <rect y="3" x="9" width="6" rx="3" height="11"></rect>
                <path d="m12 18v3"></path>
                <path d="m8 21h8"></path>
                <path d="m19 11c0 3.866-3.134 7-7 7-3.86599 0-7-3.134-7-7"></path>
              </g>
            </svg>
            <span className="label-microphone">{isRecording ? 'Detener' : 'Iniciar'}</span>
          </button>
          {audioUrl && <audio src={audioUrl} controls />}
        </div>
      </section>
      <div data-aos="fade-up">
      <section className="features-section">

        <div className="features-grid">
          <div >
            <p className='lead'>Our platform's seamless integration empowers us to generate a wide array of reports, catering to the specific needs of the child care sector. Meticulously designed, this system possesses the capability to precisely understand and fulfill the unique reporting demands of the industry.</p>
          </div>


        </div>
      </section>
     

      <br></br><br></br><br></br>
      
     
      </div>
      <div data-aos="fade-up">
        <Carousel fade interval={2000}>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={process.env.PUBLIC_URL + '/type_reports/critical_reflection.png'}
              alt="Critical reflection"
            />

          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={process.env.PUBLIC_URL + '/type_reports/daily_journal.png'}
              alt="Daily report"
            />

          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={process.env.PUBLIC_URL + '/type_reports/follow_up.png'}
              alt="Follow up"
            />

          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={process.env.PUBLIC_URL + '/type_reports/goal_report.png'}
              alt="Goal report"
            />

          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={process.env.PUBLIC_URL + '/type_reports/observations_report.png'}
              alt="Observation report"
            />

          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={process.env.PUBLIC_URL + '/type_reports/summative_assessments.png'}
              alt="Summative Assessments"
            />

          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={process.env.PUBLIC_URL + '/type_reports/weekly_reflection.png'}
              alt="Weekly Reflection"
            />

          </Carousel.Item>

        </Carousel>
        <br />
        <br />
        <br />
        <br />
      </div>
      
      {/* <section className="testimonial-section">
        <h1 className="title-testimonial" style={{ textAlign: 'center' }}>Testimonial</h1>
          <br/>
          <br/>
        <div >
          
          <Row data-aos="slide-left" data-aos-duration="1000" data-aos-delay="300">
          <Col xs={12} md={6} className="content-description">
              <h2 className="text-card-video">As a professional I have always looked for efficiency and accuracy in generating reports, and that was when I discovered Welby. This website has completely revolutionized my approach to work. Thanks to its advanced artificial intelligence technology, generating reports has become no more only faster, but also smarter</h2>
          </Col>
          
          <Col xs={12} md={6} className="content-video">
            
            <div className="video-container">
                <video width="100%" height="100%" controls> 
                    <source src={testimonio1} type="video/mp4"/>
                    Tu navegador no soporta videos.
                </video>
            </div>
             
          </Col>
          </Row>        
        </div>        
      </section>
      <section className="testimonial-section">
        <div >
          <Row >
          
          
          <Col xs={12} md={6} className="content-video">
            
            <div className="video-container">
                <video width="100%" height="100%" controls> 
                    <source src={testimonio2} type="video/mp4"/>
                    Tu navegador no soporta videos.
                </video>
            </div>
             
          </Col>
          <Col xs={12} md={6} className="content-description">
              <h2 className="text-card-video">As a professional I have always looked for efficiency and accuracy in generating reports, and that was when I discovered Welby. This website has completely revolutionized my approach to work. Thanks to its advanced artificial intelligence technology, generating reports has become no more only faster, but also smarter</h2>
          </Col>
          </Row>        
        </div>        
      </section>
      <br></br>
      <section className="testimonial-section">
          <div >
            <Row >
            <Col xs={12} md={6} className="content-description container">
                <h2 className="text-card-video">As a professional I have always looked for efficiency and accuracy in generating reports, and that was when I discovered Welby. This website has completely revolutionized my approach to work. Thanks to its advanced artificial intelligence technology, generating reports has become no more only faster, but also smarter</h2>
            </Col>
            
            <Col xs={12} md={6} className="content-video">
              
              <div className="video-container">
                  <video width="100%" height="100%" controls> 
                      <source src={testimonio3} type="video/mp4"/>
                      Tu navegador no soporta videos.
                  </video>
              </div>
            </Col>
            </Row>        
          </div>        
      </section> */}

      <section className="testimonial-section">
        <h1 className="title-testimonial" style={{ textAlign: 'center' }}>Testimonial</h1>
        <hr></hr>
          
          <Row data-aos="fade-up" >
          <Col xs={12} md={4} className="content-description1 container">
           <div className='content-video1'>
            <div className="video-container1">
                  <video width="100%" height="100%" controls> 
                      <source src={testimonio1} type="video/mp4"/>
                      Tu navegador no soporta videos.
                  </video>


              </div>
            </div> 
            <p > As a professional, I have always looked for efficiency and accuracy in generating reports.</p>

          </Col>
          
          <Col xs={12} md={4} className="content-description1 container">
           <div className='content-video1'>
            <div className="video-container1">
                <video width="100%" height="100%" controls> 
                    <source src={testimonio2} type="video/mp4"/>
                    Tu navegador no soporta videos.
                </video>
            </div>
            <p >Welby has completely revolutionized my approach to work.</p>
            </div>
             
          </Col>
          <Col xs={12} md={4} className="content-description1 container">
           <div className='content-video1'>
            
              <div className="video-container1">
                  <video width="100%" height="100%" controls> 
                      <source src={testimonio3} type="video/mp4"/>
                      Tu navegador no soporta videos.
                  </video>

              </div>
            <p >Thanks to its advanced artificial intelligence technology, generating reports has become not only faster, but also smarter.</p>
            </div> 
          </Col>
          </Row>        
              
      </section>
          <br />
          <hr /> {/* Línea horizontal */}
   
        <section className="subscription-section">
        
          <h1 >Subscription Plans </h1>
        <hr></hr>

          <div className="subscription-page" data-aos="fade-up">
        
            {cardsData.map((cardData, index) => (
              <Card key={index} {...cardData} />
            ))}
          </div>
        </section>
      
      <br />
      <br />
 

      <section className="features-section link-section">
        <h2><strong>Invite Friends, Earn Free Months!</strong></h2>
        <div className="features-grid">
          <div >
            <p className='lead'>Invite your friends to our app with a <strong>referral link</strong>. If they successfully subscribe using this link, you will receive a free month of subscription. Each friend you invite who successfully signs up will give you an additional month free. Invite more friends to get more benefits!.</p>
          </div>

        </div>
      </section>
    
      <br />
      <br></br>
      
     
    </div>

  );
}

