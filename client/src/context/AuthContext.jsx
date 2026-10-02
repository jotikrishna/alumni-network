import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount or when token changes
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to fetch authenticated user:', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;
    
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    return res.data;
  };

  // Register handler
  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    const { token: authToken, user: userData } = res.data;
    
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    return res.data;
  };

  // Update profile handler
  const updateUser = async (profileData) => {
    const res = await API.put('/users/profile', profileData);
    setUser(res.data.user);
    return res.data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        updateUser,
        logout
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

export default AuthContext;
