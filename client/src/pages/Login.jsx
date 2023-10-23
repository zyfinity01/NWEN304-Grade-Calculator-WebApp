import React, { useState } from 'react';
import Google from "../img/google.png";

const Login = () => {
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL;

  // State for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const google = () => {
    console.log(process.env);
    console.log(`${apiUrl}auth/google`);
    window.open(`${apiUrl}auth/google`, "_self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
        //redirect to /
      // If the request was successful, the user will be redirected
      
      if (!response.ok) {
        // Handle the error, maybe show a message to the user
        console.error("Login failed");
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error while logging in:", error);
    }
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Choose a Login Method</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <img src={Google} alt="" className="icon" />
            Google
          </div>
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OR</div>
        </div>
        <div className="right">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="submit" onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
