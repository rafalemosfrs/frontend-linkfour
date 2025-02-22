import { createContext, useContext, useState } from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const LinksContext = createContext();

const initialLinks = [
  {
    id: '1',
    title: 'Follow me on GitHub',
    url: 'https://github.com/yourusername',
    icon: FaGithub,
  },
  {
    id: '2',
    title: 'Connect on LinkedIn',
    url: 'https://linkedin.com/in/yourusername',
    icon: FaLinkedin,
  },
  {
    id: '3',
    title: 'Follow me on Twitter',
    url: 'https://twitter.com/yourusername',
    icon: FaTwitter,
  },
  {
    id: '4',
    title: 'Check my Instagram',
    url: 'https://instagram.com/yourusername',
    icon: FaInstagram,
  },
];

export function LinksProvider({ children }) {
  const [links, setLinks] = useState(initialLinks);

  const addLink = (newLink) => {
    setLinks([...links, { ...newLink, id: Date.now().toString() }]);
  };

  const updateLink = (id, updatedLink) => {
    setLinks(links.map(link => link.id === id ? { ...link, ...updatedLink } : link));
  };

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <LinksContext.Provider value={{ links, addLink, updateLink, deleteLink }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (!context) {
    throw new Error('useLinks must be used within a LinksProvider');
  }
  return context;
}