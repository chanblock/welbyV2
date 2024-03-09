import React, { useEffect, useState } from 'react';
import { getUser } from '../../api';
import "../../styles/Profile.css";
import {  useNavigate} from "react-router-dom";



function Profile() {
    
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            const data = await getUser(token);
            setUser(data.user);
        };

        fetchUser();
    }, []);

    const handleEditProfileClick = () => {
        navigate('/updateProfile');
    }

return (
    
        <div className="profile-container">
            {user && (
                <>
            <div className="profile-card">
                <div className="card-body">
                    <div className="column-left">
                        <br />
                        <img src="https://via.placeholder.com/150" alt="Profile" />
                        <h5 className="card-title">{user.username}</h5>
                        <p className="lead">{user.userType}</p>

                    </div>
                    <div className="column-right">
                        <h3>Information</h3>
                        <hr></hr>
                        <p className="card-text">
                            <br />
                            <strong>Email:</strong> {user.email}<br />
                            <strong>Phone Number:</strong> {user.number_phone}<br />
                            <strong>User Type:</strong> {user.userType}<br />
                            <strong>Subscription Status:</strong> {user.had_successful_subscription ? "Subscribed" : "Not Subscribed"}
                        </p>
                        {/* <a href="#" className="btn" >Edit Profile</a> */}
                        <button onClick={handleEditProfileClick} className="btn">Edit Profile</button>
                    </div>
                </div>
            </div>
                    
                </>
            )}
        </div>
    
      );
}

export default Profile;
