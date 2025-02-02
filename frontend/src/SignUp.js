import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState("");
  const [ableBtn, setAbleBtn] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAbleBtn(false);
    let form = { username: username, pwd: password, email: email };
    
    try {
      const response = await axios.post('http://localhost:5000/signUp', JSON.stringify(form), {
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.status === 201) {
        setError("");
        setMessage(response.data.success);
        setTimeout(() => navigate("/", { replace: true }), 2000);  // Redirect after success
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError("Username, email, and password are required.");
            break;
          case 409:
            setError("User already exists. Try logging in.");
            break;
          case 500:
            setError("Internal server error. Please try again later.");
            break;
          default:
            setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
      setAbleBtn(true);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!ableBtn && <button disabled style={{ cursor: 'not-allowed' }}>
          Processing
        </button>}
        {ableBtn && <button type="submit">
          Sign Up
        </button>}
      </form>
      
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SignUp;
