// src/Navbar.tsx
import React from 'react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogin }) => {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        {isLoggedIn ? (
          <li><button onClick={() => console.log('Implement logout')}>Logout</button></li>
        ) : (
          <li><a href="http://localhost:3001/auth/google" onClick={onLogin}>Login</a></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
