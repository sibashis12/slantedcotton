import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dummy = () => {
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [ableBtn, setAbleBtn] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken"); // Get the refresh token from localStorage

    try {
      if (!accessToken) {
        setError("No access token found. Please login.");
        setTimeout(() => navigate("/login", { replace: true }), 2000); // Redirect to login if no token
        return;
      }
      if (!refreshToken) {
        setError("No refresh token found. Please login.");
        setTimeout(() => navigate("/login", { replace: true }), 2000); // Redirect to login if no token
        return;
      }
      
      // Make the API request
      let req = { accessToken: accessToken, refreshToken: refreshToken };
      const response = await axios.post("https://slantedcotton-production.up.railway.app/dummy", JSON.stringify(req), {
        headers: { "Content-Type": "application/json" }
      });

      // If the request is successful, set the response data
      setData(response.data.users); // Assuming `response.data.users` is an array or an object
    } catch (err) {
      if (err.response && err.response.status === 403 && err.response.data.refresh) {
        // If token expired, try to refresh it using refresh token
        if (!refreshToken) {
          setError("No refresh token found. Please login again.");
          setTimeout(() => navigate("/login", { replace: true }), 2000); // Redirect to login
          return;
        }

        try {
          const refreshResponse = await axios.post('https://slantedcotton-production.up.railway.app/refresh', { refreshToken }, { withCredentials: true });

          // Store the new access token and refresh token (if returned) in localStorage
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);
          if (refreshResponse.data.refreshToken) {
            localStorage.setItem("refreshToken", refreshResponse.data.refreshToken); // Save new refresh token
          }

          // Retry the original request with the new access token
          const retryResponse = await axios.get("https://slantedcotton-production.up.railway.app/dummy", {
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              refreshToken: refreshToken, // Send refresh token in the body
            }
          });

          setData(retryResponse.data.users); // Use the response data

        } catch (refreshErr) {
          setError("Failed to refresh token. Please login again.");
          setTimeout(() => navigate("/login", { replace: true }), 2000); // Redirect to login
        }
      } else if (err.response) {
        // Handle unauthorized error if token is invalid or expired
        setError(err.response.data.message);
        localStorage.removeItem("accessToken"); // Remove invalid token
        localStorage.removeItem("refreshToken"); // Remove refresh token if it's invalid
        setTimeout(() => navigate("/login"), 2000); // Redirect to login
      } else {
        setError("An error occurred. Please try again.");
        setTimeout(() => navigate("/"), 2000); // Redirect to home
      }
    }
  };
  const logout = async () => {
    setAbleBtn(false);
    const refreshToken = localStorage.getItem("refreshToken");
  
    try {
      await axios.post(
        "https://slantedcotton-production.up.railway.app/logout",
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  
    // Clear tokens from local storage and navigate after logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setTimeout(() => navigate("/", { replace: true }), 2000);
  };
  
  useEffect(() => {
    fetchData();
  });

  return (
    <div className="signup-container">
      <div className="dummy-data-container">
      <h2>Protected Data</h2>
      {data ? (
        <div className="data-container">
          {Array.isArray(data) ? (
            <ul>
              {data.map((item, index) => (
                <li key={index}>{JSON.stringify(item)}</li>
              ))}
            </ul>
          ) : (
            <p>{JSON.stringify(data)}</p> // If it's an object, we convert it to a string
          )}
        </div>
      ) : error ? (
        <div className="error-container">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
        {!ableBtn && <button disabled>
          Logging Out
        </button>}
        {ableBtn && <button onClick={logout}>
          Log Out
        </button>}
    </div>
    
  );
};

export default Dummy;
