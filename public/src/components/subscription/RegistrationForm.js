// RegistrationForm.js
import React from 'react';
import AsyncSelect from 'react-select/async';

const RegistrationForm = ({ username, setUsername, phone, setPhone, email, setEmail, password, setPassword, childcare, setChildcare, loadOptions }) => {
  return (
    <>
        <div className="form-row">
              <div class="form-group col-md-4">
                  <label for="usernameInput">Username</label>
                  <input
                  id="usernameInput"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  required
                  />
              </div>
              <div class="form-group col-md-4">
                  <label for="phoneInput">Phone</label>
                  <input
                    id="phoneInput"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    required
                  />
              </div>
        </div>
      
        <div className="form-group">
            <label >Email address</label>
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
      {/* ...otros campos y lógica del formulario de registro... */}
      <div className='form-group'>
        <label >Select your Childcare:</label>
        <AsyncSelect 
          id="childcare"
          loadOptions={loadOptions}
          onChange={selectedOption => setChildcare(selectedOption)}
          placeholder="Type Childcare Center..."
        />
      </div>
      <div className="form-group">
            <label >Password</label>
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
    </>
  );
};

export default RegistrationForm;
