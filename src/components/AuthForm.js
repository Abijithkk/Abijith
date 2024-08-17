import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthForm.css';

const AuthForm = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        handleLogin();
      } else {
        handleRegister();
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[email]) {
      localStorage.setItem('currentUser', email);
      setUser(email);
      toast.success('Login successful!');
      navigate('/'); // Redirect to the home page or any other page
    } else {
      toast.error('User not found. Please register.');
    }
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[email]) {
      toast.error('User already exists. Please log in.');
    } else {
      users[email] = { watchlists: [] };
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', email);
      setUser(email);
      toast.success('Registration successful!');
      navigate('/'); // Redirect to the home page or any other page
    }
  };

  return (
    <div className="enhanced-auth-container">
      <ToastContainer />
      <div className={`enhanced-auth-card ${isLogin ? '' : 'slide-left'}`}>
        <div className="enhanced-auth-header">
          <div className="animated-logo">🔐</div>
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="enhanced-input-wrapper">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>
          <button type="submit" className="enhanced-auth-button">
            {loading ? <div className="loader"></div> : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="enhanced-auth-footer">
          <p onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'New here? Register' : 'Already registered? Login'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
