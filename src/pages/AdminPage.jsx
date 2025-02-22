import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaHome, FaUser, FaGlobe, FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api';

function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [links, setLinks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newLink, setNewLink] = useState({ title: '', url: '', platform: 'generic' });
  const [activeTab, setActiveTab] = useState('links');

  const platforms = [
    { name: 'GitHub', icon: FaGithub },
    { name: 'LinkedIn', icon: FaLinkedin },
    { name: 'Twitter', icon: FaTwitter },
    { name: 'Instagram', icon: FaInstagram },
    { name: 'Facebook', icon: FaFacebook },
    { name: 'Generic', icon: FaGlobe },
  ];

  // Carregar os links do usuário autenticado
  useEffect(() => {
    const fetchLinks = async () => {
      if (!user?.userId) {
        console.error('ID do usuário não encontrado.');
        return;
      }
  
      try {
        const response = await api.get(`/users/${user.userId}/links`);
        setLinks(response.data);
      } catch (error) {
        console.error('Erro ao buscar links:', error);
        toast.error('Falha ao carregar links.');
      }
    };
  
    fetchLinks();
  }, [user?.userId]);

  // Validar URL
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const [localProfile, setLocalProfile] = useState({
    photo: user?.photo || '',
    name: user?.name || '',
    bio: user?.bio || '',
  });
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.put(`/users/${user.userId}/profile`, localProfile);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Falha ao atualizar perfil.');
    }
  };
  

  // Adicionar Link no Banco
  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.title.trim()) {
      toast.error('O título é obrigatório.');
      return;
    }
    if (!validateUrl(newLink.url)) {
      toast.error('Insira uma URL válida.');
      return;
    }

    try {
      const response = await api.post(`/users/${user.userId}/links`, newLink);
      setLinks([...links, response.data]);
      setNewLink({ title: '', url: '', platform: 'generic' });
      toast.success('Link adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar link:', error);
      toast.error('Falha ao adicionar link.');
    }
  };

  // Atualizar Link no Banco
  const handleUpdateLink = async (id, updatedData) => {
    if (!updatedData.title.trim()) {
      toast.error('O título é obrigatório.');
      return;
    }
    if (!validateUrl(updatedData.url)) {
      toast.error('Insira uma URL válida.');
      return;
    }

    try {
      const response = await api.put(`/users/${user.userId}/links/${id}`, updatedData);
      setLinks(links.map((link) => (link.id === id ? response.data : link)));
      setEditingId(null);
      toast.success('Link atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
      toast.error('Falha ao atualizar link.');
    }
  };

  // Deletar Link no Banco
  const handleDeleteLink = async (id) => {
    if (!window.confirm('Tem certeza de que deseja excluir este link?')) return;

    try {
      await api.delete(`/users/${user.userId}/links/${id}`);
      setLinks(links.filter((link) => link.id !== id));
      toast.success('Link excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir link:', error);
      toast.error('Falha ao excluir link.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPlatformIcon = (platform) => {
    const platformName = platform?.toLowerCase() || 'generic';
    const found = platforms.find((p) => p.name.toLowerCase() === platformName);
    const Icon = found ? found.icon : FaGlobe;
    return <Icon size={20} className="text-teal-600 dark:text-teal-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
            <Link
              to="/"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2 transition-all"
            >
              <FaHome /> View Site
            </Link>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('links')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'links' ? 'bg-teal-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              Links
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'profile' ? 'bg-teal-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              <FaUser className="inline-block mr-2" /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'links' ? (
          <>
            {/* Formulário para adicionar novo link */}
            <form onSubmit={handleAddLink} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Add New Link</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">Platform</label>
                  <select
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                  >
                    {platforms.map((platform) => (
                      <option key={platform.name} value={platform.name.toLowerCase()}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">URL</label>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2 transition-all"
              >
                <FaPlus /> Add Link
              </button>
            </form>

            {/* Lista de links existentes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Manage Links</h2>
                <div className="space-y-4">
                  {links.map((link, index) => (
                    <div
                      key={link.id}
                      className="border rounded-lg p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getPlatformIcon(link.platform)}
                        <div>
                          <h3 className="font-medium text-white">{link.title}</h3>
                          <p className="text-sm text-gray-400">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            editingId === link.id ? handleUpdateLink(link.id, link) : setEditingId(link.id)
                          }
                          className="text-teal-500 hover:text-teal-300 transition-all"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-red-500 hover:text-red-300 transition-all"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Formulário de perfil
          <form onSubmit={handleProfileUpdate} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300">Profile Picture URL</label>
                <input
                  type="url"
                  value={localProfile.photo}
                  onChange={(e) => setLocalProfile({ ...localProfile, photo: e.target.value })}
                  className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                />
                {localProfile.photo && (
                  <img src={localProfile.photo} alt="Profile" className="mt-4 w-24 h-24 rounded-full" />
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                  className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                  value={localProfile.bio}
                  onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                  className="mt-1 px-4 py-2 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            >
              Save Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
