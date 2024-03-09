import React, { useState } from 'react';
import '../styles/css/sidebar.css';  // Asume que tienes un archivo CSS con los estilos necesarios
// import '../styles/js/sidebar.js';  // Asume que tienes un archivo CSS con los estilos necesarios
import { listUsers,listReport } from '../api';
import { useNavigate } from 'react-router-dom';




const Sidebar = ({ isNavExpanded, setIsNavExpanded }) => {
    const navigate = useNavigate()
    const toggleNavbar = () => {
        setIsNavExpanded(!isNavExpanded);
    };

    const handleUsersClick = async () => {
        const users = await listUsers();
        navigate('/user/list', { state: { users } });
      };
    
      const handleDashboard = async () => {
        navigate('/')
      }
   
    return (
        <div>
    <header className={`header ${isNavExpanded ? 'body-pd' : ''}`} id="header">
        <div className="header_toggle">
            <i className={`bx ${isNavExpanded ? 'bx-x' : 'bx-menu'}`} id="header-toggle" onClick={toggleNavbar}></i>
        </div>
        <div className="header_img">
            <img src="https://i.imgur.com/hczKIze.jpg" alt="" />
        </div>
    </header>
    <div className={`l-navbar ${isNavExpanded ? 'show' : ''}`} id="nav-bar">
        <nav className="nav">
            <div> <a href="#" className="nav_logo"> <i className='bx bx-layer nav_logo-icon'></i> <span className="nav_logo-name">Welby</span> </a>
            <div className="nav_list"> 
                <a type='button' className="nav_link active" onClick={handleDashboard}> <i className='bx bx-grid-alt nav_icon'></i> <span className="nav_name">Dashboard</span> </a> 
                <a type='button' className="nav_link" onClick={handleUsersClick}> <i className='bx bx-user nav_icon'></i> <span className="nav_name">Users</span> </a> 
            </div>
        </div> <a href="#" className="nav_link"> <i className='bx bx-log-out nav_icon'></i> <span className="nav_name">SignOut</span> </a>
        </nav>
    </div>
</div>

    );
};

export default Sidebar;
