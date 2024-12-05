import React from "react";
import { slide as Menu } from "react-burger-menu";
import { useAuth } from "../../../context/AuthContext";
import "./styles.css";

const Navbar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div>
      <header className="navbar">
        <div className="navbar-logo">segurança</div>
      </header>
      <Menu right>
          <a className="menu-item" href="/Home">
            Home
          </a>
          <button onClick={() => logout()}>Sair</button>
      </Menu>
    </div>
  );
};

export default Navbar;
