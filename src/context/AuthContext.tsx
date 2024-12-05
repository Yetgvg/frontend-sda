import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';  // Importe o useNavigate

interface User {
  id: number;
  name: string;
  role: 'admin' | 'user'; // Define as permissões
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: 'admin' | 'user' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();  // Cria o hook de navegação

  useEffect(() => {
    // Tente carregar o usuário do localStorage ou de um estado persistido
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user)); // Salve o usuário autenticado no localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Limpe o localStorage ao deslogar
    navigate('/'); // Redireciona para a página de login após o logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, userRole: user?.role || null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
