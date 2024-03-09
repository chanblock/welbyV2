import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import { resetPassword } from '../../api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const showAlert = (message, type = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

 
  const handleBack = () => {
    navigate("/auth")
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const newPassword = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      showAlert("Passwords don't match", 'danger');
      setLoading(false);
      return;
    }

    try {
      const data = await resetPassword(token, newPassword);
      showAlert(data.message, 'success');
      setLoading(false);
    } catch (error) {
      console.error('Failed to reset password:', error);
      showAlert('An error occurred, please try again', 'danger');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <hr />
        {alertVisible && (
          <Alert
            variant={alertType}
            onClose={() => setAlertVisible(false)}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            required
          />
          <button className="button-shared auth-submit" type="submit">
            Reset Password
            {loading && (
              <Spinner
                animation="border"
                size="sm"
                style={{ marginLeft: '8px' }}
              />
            )}
          </button>
          <button  className="button-shared auth-toggle" type="button" onClick={handleBack}>
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
