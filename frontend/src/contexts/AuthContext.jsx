import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        
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

  const login = async (email, password) => {
    try {
      console.log('🚀 AuthContext login called with:', { email });
      
      // Call the real authentication endpoint
      const response = await fetch('https://shatayu-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // Log response for debugging
      console.log('📊 Login response:', { status: response.status, data });
      
      if (response.ok && data.success && data.token) {
        const { token: authToken, user: userData } = data;
        
        console.log('✅ Login successful, storing token...');
        
        // Store token in localStorage
        localStorage.setItem('authToken', authToken);
        
        // Decode token to get user info
        const decoded = jwtDecode(authToken);
        
        setToken(authToken);
        const userInfo = {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name
        };
        setUser(userInfo);
        
        console.log('👤 User info set:', userInfo);
        console.log('✅ Login successful - returning user data');
        
        return { success: true, user: userInfo };
      }
      
      // Log why login failed
      console.error('❌ Login failed:', data);
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      console.error('💥 Login error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;