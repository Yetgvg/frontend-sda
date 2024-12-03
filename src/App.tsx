// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from '../src/routes/PrivateRoutes';
import AdminPage from './pages/Admin';
import UserPage from './pages/userManagement/User'; 
import Login from './pages/login/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminPage /></PrivateRoute>} />
          <Route path="/user" element={<PrivateRoute role="user"><UserPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
