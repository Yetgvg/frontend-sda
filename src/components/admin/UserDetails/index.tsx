import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../NavBar/index";
import "./styles.css";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
  cpf: string;
  termo: string;
};

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/usuarios/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
      }
    };
    fetchUser();
  }, [id]);

  const handleAction = async (action: "activate" | "deactivate" | "delete") => {
    try {
      if (action === "delete") {
        await axios.delete(`http://localhost:3000/usuarios/${id}`);
        navigate("/users");
      } else {
        const status = action === "activate" ? "active" : "inactive";
        await axios.patch(`http://localhost:3000/usuarios/${id}`, { status });
        setUser((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (error) {
      console.error(`Erro ao realizar ação ${action}:`, error);
    }
  };

  if (!user) {
    return <h2>Usuário não encontrado</h2>;
  }

  return (
    <div>
      <Navbar />
      <div className="user-details">
        <button className="back-button" onClick={() => navigate("/users")}>
          Voltar
        </button>
        <h2>Detalhes do Usuário</h2>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {user.status === "active" ? "Ativo" : "Inativo"}</p>
        <p><strong>Versão do termo:</strong> {user.termo}</p>
        <div className="actions">
          {user.status === "inactive" ? (
            <button onClick={() => handleAction("activate")}>Ativar</button>
          ) : (
            <button onClick={() => handleAction("deactivate")}>Desativar</button>
          )}
          <button onClick={() => handleAction("delete")}>Excluir</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
