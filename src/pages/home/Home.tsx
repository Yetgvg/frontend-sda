import Navbar from '../../components/admin/NavBar/index';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleUpdate = () => {
        // Redireciona para a tela de atualização do usuário
        navigate('/atualizar');
    };

    const handleDelete = async () => {

        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Você precisa estar logado.');
            return;
        }

        // Decodifica o token novamente para pegar o ID do usuário
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Exibe a confirmação de exclusão
        const confirmDelete = window.confirm('Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');

        if (confirmDelete) {
            try {
                // Fazendo a requisição para deletar o usuário
                const response = await axios.delete(`http://localhost:3002/usuarios/deletar/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSuccessMessage('Usuário excluído com sucesso!');
                // Agora, faz a requisição para esquecer o usuário
                const motivo = 'Usuário excluído';  // Pode ser um motivo mais específico, se necessário
                const forgetResponse = await axios.post('http://localhost:3003/esquecer', {
                    id_usuario: userId,
                    motivo,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(forgetResponse.data);

                // Redireciona para a tela de login após exclusão
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/');
            } catch (error: any) {
                console.error(error);
                if (error.response) {
                    setErrorMessage(error.response.data.error || 'Erro ao excluir o usuário');
                } else {
                    setErrorMessage('Erro de conexão com o servidor');
                }
            }
        } else {
            // Se o usuário cancelar a exclusão, mostramos um alerta
            setErrorMessage('Ação de exclusão cancelada.');
        }
    };

    const handleInativar = async () => {

        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Você precisa estar logado.');
            return;
        }

        // Decodifica o token novamente para pegar o ID do usuário
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Exibe a confirmação de exclusão
        const confirmDelete = window.confirm('Você tem certeza que deseja inativar sua conta? Esta ação não pode ser desfeita.');

        if (confirmDelete) {
            try {
                // Fazendo a requisição para deletar o usuário
                const response = await axios.patch(`http://localhost:3002/usuarios/${userId}/inativar`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSuccessMessage('Usuário inativo com sucesso!');
                // Redireciona para a tela de login após exclusão
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/');
            } catch (error: any) {
                console.error(error);
                if (error.response) {
                    setErrorMessage(error.response.data.error || 'Erro ao inativar o usuário');
                } else {
                    setErrorMessage('Erro de conexão com o servidor');
                }
            }
        } else {
            // Se o usuário cancelar a exclusão, mostramos um alerta
            setErrorMessage('Ação de inativar cancelada.');
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Bem-vindo </h1>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <div style={{ marginTop: '20px' }}>
                <button onClick={handleUpdate} style={{ marginRight: '10px' }}>
                    Atualizar Usuário
                </button>
                <button onClick={handleDelete} style={{ marginRight: '10px' }}>Deletar Usuário</button>
                {/* <button onClick={handleInativar}>Inativar Usuário</button> */}
            </div>
        </div>
    );
};

export default Home;
