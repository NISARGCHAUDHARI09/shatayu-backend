import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '../lib/apiClient';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient' | 'staff';
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      try {
        const decoded = jwtDecode<any>(savedToken);
        
        // Check if token is expired (skip check if no expiration set)
        if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser({
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
          });
        } else {
          // Token expired, remove it
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use the API client for login
      const result = await apiClient.login({ email, password });
      
      console.log('Login result:', result);
      
      if (result.success && result.token) {
        const { token: authToken } = result;
        
        // Store token in localStorage
        localStorage.setItem('authToken', authToken);
        
        // Decode token to get user info or use provided user data
        let userInfo;
        try {
          const decoded = jwtDecode<any>(authToken);
          userInfo = {
            id: decoded.id || '1',
            username: decoded.username || result.user?.username || 'doctor',
            email: decoded.email || result.user?.email || 'doctor@hospital.com',
            role: decoded.role || result.user?.role || 'doctor',
            name: decoded.name || decoded.username || result.user?.username || 'Doctor'
          };
        } catch (decodeError) {
          // If JWT decode fails, use provided user data
          userInfo = {
            id: result.user?.id || '1',
            username: result.user?.username || 'doctor',
            email: result.user?.email || 'doctor@hospital.com',
            role: result.user?.role || 'doctor',
            name: result.user?.name || result.user?.username || 'Doctor'
          };
        }
        
        setToken(authToken);
        setUser(userInfo);
        
        // Role-based redirect after successful login
        setTimeout(() => {
          switch (userInfo.role) {
            case 'admin':
              window.location.href = '/admin/dashboard';
              break;
            case 'doctor':
              window.location.href = '/doctor/opd';
              break;
            case 'patient':
              window.location.href = '/patient';
              break;
            default:
              window.location.href = '/';
          }
        }, 100);
        
        return true;
      }
      
      // Log why login failed
      console.error('Login failed:', result.error || 'Unknown error');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};