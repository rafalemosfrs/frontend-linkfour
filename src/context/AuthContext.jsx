import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';

export const login = async (email, password) => {
  try {
    const response = await axios.post('https://linkfour-backend.vercel.app/login', { email, password }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { token, userId, email: userEmail } = response.data;
    localStorage.setItem('token', token);

    console.log('Login bem-sucedido. Token:', token);
    return { userId, userEmail, token };
  } catch (error) {
    console.error('Erro no login:', error.response?.data || error.message);
    return null;
  }
};


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Verificar se há um token salvo e validar o usuário
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Função de login via API
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, userId, email: userEmail } = response.data;
  
      // Salva o token e os dados do usuário
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userId, email: userEmail }));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      setUser({ userId, email: userEmail });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acessar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
