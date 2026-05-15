import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );

      console.log('Login response:', response.data);

      if (response.data.success) {
        setUser(response.data.user);
        // Store JWT in localStorage
        localStorage.setItem('token', response.data.token);

        // Redirect based on role
        if (response.data.user.role === 'admin') navigate('/admin');
        else navigate('/dashboard');

        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Get current user from token if needed
  const getCurrentUser = () => user;

  return (
    <AuthContext.Provider value={{ user, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
