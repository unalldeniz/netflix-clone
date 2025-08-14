import React, { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import { onAuthStateChanged } from 'firebase/auth'
import { ToastContainer } from "react-toastify";
import { auth } from './firabase'

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/player/:id"
          element={user ? <Player /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}

export default App
