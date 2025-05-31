import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken, getCurrentUser } from '../services/authService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendVerificationCode: (email: string) => Promise<string>;
  verifyCode: (email: string, code: string) => Promise<void>;
  loginWithGoogle: () => void;
  login: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Checking auth token in localStorage:', token ? 'Token found' : 'No token found');

        if (token) {
          const isValid = await validateToken(token);
          console.log('Token validation result:', isValid);

          if (isValid) {
            const userData = await getCurrentUser();
            if (userData) {
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              console.log('No user data found, clearing auth state');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            console.log('Token invalid, clearing localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('No token, setting user as unauthenticated');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const sendVerificationCode = async (email: string): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await authService.sendVerificationCode(email);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await authService.verifyCode(email, code);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    setIsLoading(true);
    try {
      window.location.href = 'http://localhost:8080/auth/login/google';
    } catch (error) {
      console.error('Error redirecting to Google login:', error);
      setIsLoading(false);
    }
  };

  const login = async (userData: any) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        sendVerificationCode,
        verifyCode,
        loginWithGoogle,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};