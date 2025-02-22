import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(email, password);
    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } else {
      toast.error('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Login de Administrador
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>

        {/* Botão para Registro */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Não tem uma conta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-teal-500 hover:underline"
            >
              Cadastre-se aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
