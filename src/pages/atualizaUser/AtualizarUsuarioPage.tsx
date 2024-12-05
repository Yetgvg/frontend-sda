import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/admin/NavBar';

const AtualizarUsuarioPage: React.FC = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Obtém o token armazenado no localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Você precisa estar logado.');
            return;
        }
        console.log(token)

        // Decodifica o token novamente para pegar o ID do usuário
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        if (!decodedToken.id) {
            setErrorMessage('ID do usuário não encontrado no token');
            return;
        }

        // Função para buscar os dados do usuário com o ID extraído
        const fetchUserData = async () => {
            try {
                // Fazendo a requisição para buscar os dados do usuário com o ID do token
                const response = await axios.get(`http://localhost:3002/usuarios/listar/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Preenche os campos com os dados obtidos
                setNome(response.data.nome);
                setEmail(response.data.email);
                setTelefone(response.data.telefone);
            } catch (error) {
                setErrorMessage('Erro ao carregar os dados do usuário');
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Você precisa estar logado');
            return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        try {
            // Atualiza os dados do usuário
            const response = await axios.put(
                `http://localhost:3002/usuarios/atualizar/${userId}`,  // Rota para atualizar o usuário
                { nome, email, telefone },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Usuário atualizado com sucesso!');
            navigate('/home');  // Redireciona para a página Home após a atualização
        } catch (error) {
            setErrorMessage('Erro ao atualizar o usuário');
            console.error(error);
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Atualizar Usuário</h1>
            <div>
                <label>Nome</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Telefone</label>
                <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                />
            </div>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <button onClick={handleUpdate}>Atualizar</button>
        </div>
    );
};

export default AtualizarUsuarioPage;
