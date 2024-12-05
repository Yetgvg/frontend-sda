// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from '../src/routes/PrivateRoutes';
import AdminPage from './pages/Admin';
import UserPage from './pages/userManagement/User';
import Login from './pages/login/Login';
import CadastroPage from './pages/cadastro/Cadastro';
import Home from './pages/home/Home';
import AtualizarUsuarioPage from './pages/atualizaUser/AtualizarUsuarioPage';
import TermosPage from './pages/termospendentes/Termo_Pendente';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path='/termos' element={<TermosPage/>}/>
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/atualizar" element={<AtualizarUsuarioPage />} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminPage /></PrivateRoute>} />
          <Route path="/user" element={<PrivateRoute role="user"><UserPage /></PrivateRoute>} />
        </Routes>

      </AuthProvider>
    </Router>
  );
};

export default App;
