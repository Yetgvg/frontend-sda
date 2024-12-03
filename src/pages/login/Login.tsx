import React, { useState } from 'react';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fazendo a requisição ao backend
      const response = await axios.post('http://localhost:3002/login', {
        email,
        senha,
      });

      // Salvando o token no localStorage
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Redirecionar ou informar que o login foi bem-sucedido
      alert('Login realizado com sucesso!');
      // Por exemplo, redirecionar:
      // window.location.href = '/dashboard';

    } catch (error: any) {
      // Tratamento de erros
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Erro ao realizar login');
      } else {
        setErrorMessage('Erro de conexão com o servidor');
      }
    }
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
    </div>
  );
};

export default LoginPage;
