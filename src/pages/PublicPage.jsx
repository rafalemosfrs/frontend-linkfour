import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';
import LinkCard from '../components/LinkCard';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function PublicPage() {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;

      try {
        const response = await api.get(`/users/${user.userId}/profile`);
        const { profile, links } = response.data;

        setProfile(profile);
        setLinks(links);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl px-4 py-16">
        {/* Perfil dinâmico */}
        {profile ? (
          <Profile
            name={profile.name}
            bio={profile.bio}
            avatar={profile.avatar || 'https://placehold.co/200x200'}
          />
        ) : (
          <p className="text-center text-gray-500">Carregando perfil...</p>
        )}

        {/* Lista de links dinâmicos */}
        <div className="space-y-4 mt-6">
          {links.length > 0 ? (
            links.map((link, index) => (
              <div
                key={link.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LinkCard title={link.title} url={link.url} platform={link.platform} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Nenhum link disponível.</p>
          )}
        </div>

        {/* Botão de Login */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition"
          >
            Login de administrador
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicPage;
