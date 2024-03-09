// LoginForm.js
import React from 'react';

const LoginForm = ({ email, setEmail, password, setPassword }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="emailInput">Email address</label>
        <input
          id="emailInput"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="passwordInput">Password</label>
        <input
          id="passwordInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          required
        />
      </div>
      {/* ...otros campos y lógica relacionada con el inicio de sesión... */}
    </>
  );
};

export default LoginForm;
