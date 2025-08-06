import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  clearTokens,
  clearUser,
  getUserFromStorage,
  setAccessToken,
  setRefreshToken,
  setUserToStorage
} from "@/utils/token-storage.js";
const UserContext = createContext(null);
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/128/6997/6997662.png";

export const UserProvider = ({ children }) => {
  const initialUserState = {userId: null, email: null, role: null, username: null, isVerified: false, isBanned: false, provider: null};

  const [user, setUser] = useState(initialUserState);

  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);

  const login = ({accessToken, refreshToken, user}) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserToStorage(user);
  };

  const logout = () => {
    setUser(initialUserState);
    clearTokens();
    clearUser();
    setAvatarUrl(DEFAULT_AVATAR);
  };

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const value = { user, loading, avatarUrl, setAvatarUrl, login, logout };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
