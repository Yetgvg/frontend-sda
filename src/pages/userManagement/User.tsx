import React from "react";
import { Outlet } from "react-router-dom";
import UserList from "../../components/admin/UserList";
import Navbar from "../../components/admin/NavBar/index"; // Import Navbar component

const UserPage: React.FC = () => {
  return (
    <div className="user-page">
      <Navbar /> {/* Add Navbar component */}
      <h1>Gerenciamento de Usuários</h1>
      <UserList/>
      <Outlet />
    </div>
  );
};

export default UserPage;


