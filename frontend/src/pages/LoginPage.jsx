import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "Teacher1" && password === "Teacher@456") {
      navigate("/teacher-dashboard"); // Redirect to Teacher Dashboard
    } else {
      setError("Invalid Username or Password!");
    }
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <h1 className="title">
          <span className="blue">DIGITAL</span>{" "}
          <span className="orange">ATTENDANCE</span>{" "}
          <span className="blue">SYSTEM</span>
        </h1>

        <div className="form-group">
          <label>Enter Username</label>
          <input 
            type="text" 
            placeholder="eg. Teacher1" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Enter Password</label>
          <input 
            type="password" 
            placeholder="eg. Teacher@456" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
