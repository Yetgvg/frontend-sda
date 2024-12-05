import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TermosPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const termo = location.state?.termo;

  const [termosAceitos, setTermosAceitos] = useState<{ [key: string]: boolean }>({}); // Armazenar os termos aceitos

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!termo) {
      setErrorMessage('Termo pendente não encontrado.');
      return;
    }

    // Inicializa o estado com os termos obrigatórios
    const initialTermsState: { [key: string]: boolean } = {};

    termo.itens_obrigatorios.forEach((item: any) => {
      initialTermsState[item.titulo] = false; // Definir como não aceito inicialmente
    });

    termo.itens_opcionais.forEach((item: any) => {
      initialTermsState[item.titulo] = false; // Definir como não aceito inicialmente
    });

    setTermosAceitos(initialTermsState);
  }, [termo]);

  const handleAceitar = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não autenticado');

      setLoading(true);
      setErrorMessage(null); // Resetar mensagens de erro
      setSuccessMessage(null); // Resetar mensagens de sucesso

      // Enviar consentimento dos termos
      if (termo) {
        // Enviar os termos obrigatórios
        for (const item of termo.itens_obrigatorios) {
          const aceito = termosAceitos[item.titulo] || false;
          await axios.post('http://localhost:3002/historicoConsentimento/criar', {
            id_usuario: userId,
            id_termo: termo.id,
            aceito,
            confirmado: true
          });
        }

        // Enviar os termos opcionais
        for (const item of termo.itens_opcionais) {
          const aceito = termosAceitos[item.titulo] || false;
          await axios.post('http://localhost:3002/historicoConsentimento/criar', {
            id_usuario: userId,
            id_termo: termo.id,
            aceito,
            confirmado: true
          });
        }
      }

      setSuccessMessage('Termos aceitos com sucesso!');
      navigate('/Home'); // Redireciona para a tela principal após aceitar os termos
    } catch (error) {
      setErrorMessage('Erro ao aceitar os termos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!termo) {
    return <div>Erro: Termo pendente não encontrado.</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1>Termos de Uso</h1>
      <h2>Itens Obrigatórios</h2>
      {termo.itens_obrigatorios.map((item: any) => (
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

      <h2>Itens Opcionais</h2>
      {termo.itens_opcionais.map((item: any) => (
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

      {errorMessage && <div style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green', marginTop: '1rem' }}>{successMessage}</div>}

      <button onClick={handleAceitar} style={{ marginTop: '1rem' }} disabled={loading}>
        {loading ? 'Aceitando...' : 'Aceitar Termos'}
      </button>
    </div>
  );
};

export default TermosPage;
