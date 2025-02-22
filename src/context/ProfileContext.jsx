import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    name: 'Your Name',
    bio: 'Frontend Developer | React Enthusiast | Open Source Contributor',
  });

  const updateProfile = (newProfile) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
