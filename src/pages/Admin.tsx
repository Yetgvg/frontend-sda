import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => navigate('/users')}>Gerenciar Usuários</button>
    </div>
  );
};

export default AdminPage;
