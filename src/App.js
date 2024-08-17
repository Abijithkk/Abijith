import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import AuthForm from './components/AuthForm';
import WatchlistPage from './components/WatchlistPage';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={user ? <Home user={user} /> : <AuthForm setUser={setUser} />} 
        />
        <Route 
          path="/auth" 
          element={<AuthForm setUser={setUser} />} 
        />
        <Route 
          path="/watchlist/:watchlistId" 
          element={user ? <WatchlistPage /> : <AuthForm setUser={setUser} />} 
        />
      </Routes>
    </div>
  );
}

export default App;
