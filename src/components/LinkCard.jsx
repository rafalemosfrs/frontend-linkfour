import { useState } from 'react';
import { FaGlobe, FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

function LinkCard({ title, url, platform }) {
  const [isHovered, setIsHovered] = useState(false);

  const platforms = {
    github: FaGithub,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
    facebook: FaFacebook,
    generic: FaGlobe,
  };

  const Icon = platforms[platform?.toLowerCase()] || FaGlobe;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800">
        <Icon
          className={`h-6 w-6 transition-colors duration-300 ${
            isHovered ? 'text-teal-500' : 'text-gray-600 dark:text-gray-400'
          }`}
        />

        <span className="text-gray-700 dark:text-gray-200">{title}</span>
      </div>
    </a>
  );
}

export default LinkCard;
