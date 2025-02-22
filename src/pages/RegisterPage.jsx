import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function RegisterPage() {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      avatar,
      name,
      email,
      password,
    };

    try {
      const response = await fetch('https://linkfour-backend.vercel.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success('Registro bem-sucedido! Faça login para continuar.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Falha no registro.');
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast.error('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Registro</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo para Link do Avatar */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link do Avatar
            </label>
            <input
              type="url"
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://exemplo.com/minha-foto.png"
              className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Campo para Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Seu nome'
              className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Campo para E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Seu e-mail'
              className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Campo para Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Sua senha'
              className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Botão de Registro */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Registrar
          </button>
        </form>

        {/* Link para Login */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Já tem uma conta?{' '}
            <button onClick={() => navigate('/login')} className="text-teal-500 hover:underline">
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
