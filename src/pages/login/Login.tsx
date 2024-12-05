import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fazendo a requisição ao backend
      const response = await axios.post('http://localhost:3002/auth/login', {
        email,
        senha,
      });

      const { status, termo, token, idUsuario } = response.data;

      if (status === 'pendente') {
        console.log(response.data)
        // Salva o ID do usuário temporariamente para aceitar os termos
        localStorage.setItem('userId', idUsuario);

        // Redirecionar para a página de termos pendentes
        navigate('/termos', { state: { termo } });
      } else {
        // Salva o token e o ID do usuário no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', idUsuario);

        // Redirecionando para a tela principal
        alert('Login realizado com sucesso!');
        navigate('/home');
      }
    } catch (error: any) {
      // Tratamento de erros
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Erro ao realizar login');
      } else {
        setErrorMessage('Erro de conexão com o servidor');
      }
    }
  };

  const navigateToCadastro = () => {
    navigate('/cadastro');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        {errorMessage && (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            {errorMessage}
          </div>
        )}
        <button type="submit">Entrar</button>
      </form>
      <button onClick={navigateToCadastro} style={{ marginTop: '1rem' }}>
        Criar uma Conta
      </button>
    </div>
  );
};

export default LoginPage;
