import React from 'react'
import { Link } from 'react-router-dom'
const Hello = () => {
  return (
    <div className="container Hello">
      <div className="box">
        <h1>Welcome to <span className="highlight">Dummy</span> Website</h1>
        <p>Your journey starts here. Join us today!</p>
        <div className="button-group">
          <Link to="/signUp" className="btn btn-signup">Sign Up</Link>
          <Link to="/login" className="btn btn-login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Hello