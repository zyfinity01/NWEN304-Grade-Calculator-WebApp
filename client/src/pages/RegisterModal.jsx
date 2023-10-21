// RegisterModal.jsx

import { useState } from 'react';
import './RegisterModal.css';


const RegisterModal = ({ setShowRegisterModal }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({username, password})
    });

    if(response.ok) {
      setShowRegisterModal(false);
    }
  }

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default RegisterModal;
