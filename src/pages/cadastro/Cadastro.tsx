import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CadastroPage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [termos, setTermos] = useState<any>(null); // Termos obrigatórios e opcionais
  const [termosAceitos, setTermosAceitos] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  // Carregar os termos ao montar o componente
  useEffect(() => {
    const loadTermos = async () => {
      try {
        const response = await axios.get('http://localhost:3002/termo/listar');

        // Verifica se os dados retornados são válidos
        if (response.data && response.data[0] && response.data[0].itens_obrigatorios && response.data[0].itens_opcionais) {
          const termosData = response.data[0]; // Acessa o primeiro item do array
          setTermos(termosData);

          // Inicializa um objeto para armazenar o estado dos termos aceitos
          const initialTermsState: { [key: string]: boolean } = {};

          // Adiciona os termos obrigatórios no estado
          termosData.itens_obrigatorios.forEach((item: any) => {
            initialTermsState[item.titulo] = false;
          });

          // Adiciona os termos opcionais no estado
          termosData.itens_opcionais.forEach((item: any) => {
            initialTermsState[item.titulo] = false;
          });

          // Atualiza o estado com os termos
          setTermosAceitos(initialTermsState);
        } else {
          setErrorMessage('Dados de termos inválidos.');
        }
      } catch (error) {
        console.error('Erro ao carregar os termos', error);
        setErrorMessage('Erro ao carregar os termos.');
      }
    };

    loadTermos();
  }, []);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se todos os termos obrigatórios foram aceitos
    const termosNaoAceitos = termos?.itens_obrigatorios.filter((item: any) => !termosAceitos[item.titulo]);

    if (termosNaoAceitos?.length > 0) {
      alert('Você precisa aceitar todos os termos obrigatórios.');
      return;
    }

    try {
      // Fazendo a requisição ao backend para criar o usuário
      const responseUsuario = await axios.post('http://localhost:3002/usuarios/criar', {
        nome,
        email,
        senha,
        cpf,
        telefone,
        role: 'ADMIN', // Pode ser alterado conforme o tipo de usuário
      });

      const idUsuario = responseUsuario.data.id; // Pegue o ID do usuário criado

      // Segunda requisição: Importando o usuário após a criação
      await axios.post('http://localhost:3003/importar', {
        email,
        senha,
      });

      // Agora, registrar os consentimentos dos termos aceitos
      if (termos) {
        // Enviar consentimentos dos termos obrigatórios
        for (const item of termos.itens_obrigatorios) {
          const aceito = termosAceitos[item.titulo] || false;
          await axios.post('http://localhost:3002/historicoConsentimento/criar', {
            id_usuario: idUsuario,
            id_termo: termos.id, // O ID do termo, você pode ter que ajustar conforme sua estrutura
            aceito,
          });
        }

        // Enviar consentimentos dos termos opcionais
        for (const item of termos.itens_opcionais) {
          const aceito = termosAceitos[item.titulo] || false;
          await axios.post('http://localhost:3002/historicoConsentimento/criar', {
            id_usuario: idUsuario,
            id_termo: termos.id, // O ID do termo, ajuste conforme necessário
            aceito,
          });
        }
      }

      // Redirecionando para o login após cadastro
      alert('Cadastro realizado com sucesso!');
      navigate('/'); // Redireciona para a tela de login após o cadastro

    } catch (error: any) {
      // Tratamento de erros
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Erro ao realizar cadastro');
      } else {
        setErrorMessage('Erro de conexão com o servidor');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <h1>Cadastro</h1>
      <form onSubmit={handleCadastro}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="telefone">Telefone</label>
          <input
            id="telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        {/* Exibindo os termos para o usuário aceitar */}
        <div>
          <h3>Termos e Condições</h3>
          {termos && termos.itens_obrigatorios && (
            <div>
              <h4>Termos Obrigatórios</h4>
              {termos.itens_obrigatorios.map((item: { titulo: string }) => (
                <div key={item.titulo}>
                  <label>
                    <input
                      type="checkbox"
                      checked={termosAceitos[item.titulo]}
                      onChange={(e) =>
                        setTermosAceitos((prev) => ({
                          ...prev,
                          [item.titulo]: e.target.checked,
                        }))
                      }
                    />
                    {item.titulo}
                  </label>
                </div>
              ))}
            </div>
          )}

          {termos && termos.itens_opcionais && (
            <div>
              <h4>Termos Opcionais</h4>
              {termos.itens_opcionais.map((item: { titulo: string }) => (
                <div key={item.titulo}>
                  <label>
                    <input
                      type="checkbox"
                      checked={termosAceitos[item.titulo]}
                      onChange={(e) =>
                        setTermosAceitos((prev) => ({
                          ...prev,
                          [item.titulo]: e.target.checked,
                        }))
                      }
                    />
                    {item.titulo}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroPage;
