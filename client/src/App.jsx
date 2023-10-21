import Navbar from "./components/Navbar";
import "./app.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterModal from "./pages/RegisterModal";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const getUser = () => {
      fetch(`${process.env.REACT_APP_BACKEND_API_URL}auth/login/success`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        {/* <Navbar user={user} /> */}
        <Navbar user={user} setShowRegisterModal={setShowRegisterModal} />
        {showRegisterModal && <RegisterModal setShowRegisterModal={setShowRegisterModal} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
