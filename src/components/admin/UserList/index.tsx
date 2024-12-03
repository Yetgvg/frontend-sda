import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  cpf: string;
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/usuarios");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      <table className="user-table">
        <thead>
          <tr>
            <th className="user-header">Nome</th>
            <th className="user-header">Email</th>
            <th className="user-header">CPF</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="user-item"
              onClick={() => navigate(`/users/${user.id}`)}
            >
              <td className="user-data">{user.name}</td>
              <td className="user-data">{user.email}</td>
              <td className="user-data">{user.cpf}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
