import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const login = (userData, hospitalData = null) => {
    setUser(userData);
    setSelectedHospital(hospitalData);
  };

  const logout = () => {
    setUser(null);
    setSelectedHospital(null);
  };

  const switchHospital = (hospitalData) => {
    setSelectedHospital(hospitalData);
  };

  const value = {
    user,
    selectedHospital,
    login,
    logout,
    switchHospital,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
