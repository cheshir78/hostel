import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hostel_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hostel_token');
      const savedUserStr = localStorage.getItem('hostel_user');

      if (savedToken && savedUserStr) {
        try {
          const parsedUser: User = JSON.parse(savedUserStr);
          setUser(parsedUser);
          setToken(savedToken);

          // Verify with backend
          const res = await apiClient.get('/api/auth/me');
          setUser(res.data);
          localStorage.setItem('hostel_user', JSON.stringify(res.data));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (authData: AuthResponse) => {
    setToken(authData.token);
    const userData: User = {
      id: 0,
      username: authData.username,
      roles: authData.roles || []
    };
    setUser(userData);
    localStorage.setItem('hostel_token', authData.token);
    localStorage.setItem('hostel_user', JSON.stringify(userData));

    // Fetch full profile asynchronously
    apiClient.get('/api/auth/me')
      .then(res => {
        setUser(res.data);
        localStorage.setItem('hostel_user', JSON.stringify(res.data));
      })
      .catch(() => {});
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hostel_token');
    localStorage.removeItem('hostel_user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;
  const isUser = user?.roles?.includes('ROLE_USER') ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isUser,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
