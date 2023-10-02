import React, { useState } from 'react';
import './App.css';
import Navbar from './Navbar.tsx';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Assume a proper check or an API call to determine if a user is logged in
  
  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} />
      <header className="App-header">
        <h1>Welcome to Home Page</h1>
      </header>
    </div>
  );
};

export default App;
