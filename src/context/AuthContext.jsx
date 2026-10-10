import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillbridge_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('skillbridge_token');
      const storedUser = localStorage.getItem('skillbridge_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify with server /me endpoint
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('skillbridge_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Session verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, id, email: userEmail, fullName, role } = res.data;
    const userData = { id, email: userEmail, fullName, role };

    localStorage.setItem('skillbridge_token', token);
    localStorage.setItem('skillbridge_user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    return userData;
  };

  const register = async (registerData) => {
    const res = await api.post('/auth/register', registerData);
    const { token, id, email, fullName, role } = res.data;
    const userData = { id, email, fullName, role };

    localStorage.setItem('skillbridge_token', token);
    localStorage.setItem('skillbridge_user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    return userData;
  };

  const demoLogin = async (type = 'student') => {
    const res = await api.post(`/auth/demo-login/${type}`);
    const { token, id, email, fullName, role } = res.data;
    const userData = { id, email, fullName, role };

    localStorage.setItem('skillbridge_token', token);
    localStorage.setItem('skillbridge_user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user');
    setToken(null);
    setUser(null);
  };

  const isStudent = user?.role === 'ROLE_STUDENT';
  const isRecruiter = user?.role === 'ROLE_EMPLOYER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isStudent,
        isRecruiter,
        loading,
        login,
        register,
        demoLogin,
        logout,
        setUser,
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
