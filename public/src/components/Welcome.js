import React from 'react';
import '../styles/Card.css';  // Asume que tienes un archivo CSS con los estilos necesarios
import '../styles/Welcome.css';  // Asume que tienes un archivo CSS con los estilos necesarios
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from "react-router-dom";


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

  return (

    <div className="home-container">
      <br></br>
      
      <section className="intro-section ">
        {/* <h1 className="display-1">Welcome to WriteWise</h1> */}
        <h1 className="display-1">
            <img src={process.env.PUBLIC_URL + '/logoWelby3.png'} alt="Welly Logo"  />
           
        </h1>
        <br />
        <p className="lead " >Introducing Welby, a revolutionary tool meticulously crafted to streamline the daily responsibilities of child care professionals. Leveraging state-of-the-art artificial intelligence technology, this innovative system provides services custom-tailored to alleviate your workload,
         enabling you to channel your energy where it matters most: nurturing and caring for the children.</p>
        <br />
        <button className="button" onClick={handleRegister}>Sign up for Free</button>
      </section>
      <section className="features-section">
        
        <div className="features-grid">
          <div >
            <p className='lead'>Our platform's seamless integration empowers us to generate a wide array of reports, catering to the specific needs of the child care sector. Meticulously designed, this system possesses the capability to precisely understand and fulfill the unique reporting demands of the industry.</p>
          </div>

          
        </div>
      </section>
      <br></br><br></br><br></br>
    
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
      <hr />
      <br />
      
      <section className="subscription-section">
        <h2>Subscription Plans </h2>
        <div className="subscription-page">
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

