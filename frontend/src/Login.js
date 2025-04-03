import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [ableBtn, setAbleBtn] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAbleBtn(false);
    let form = { username: username, pwd: password };
    
    try {
      const response = await axios.post(process.env.BACKEND_URI+'/login', JSON.stringify(form), {
        headers: { "Content-Type": "application/json" },
      });//for some reason get routes not working. maybe get routes do not have body stuff in request tags.
      
      if (response.status === 200) {
        setError("");
        // console.log(response.data);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setMessage(`Welcome ${response.data.username}!`);
        setTimeout(() => navigate("/dummy", { replace: true }), 1000);  // Redirect after success
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError("Username, and password are required.");
            break;
          case 401:
            setError("Wrong username or password. Please sign up if you do not have an account.");
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
        <h2>Login</h2>
        
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
          Log In
        </button >}
      </form>
      
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
