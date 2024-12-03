import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // Altere para a URL da sua API

export const login = async (email: string, senha: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, senha });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Erro ao conectar com o servidor');
    }
  }
};
