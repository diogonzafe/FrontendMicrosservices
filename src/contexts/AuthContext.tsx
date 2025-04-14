import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { AuthResponse } from '../services/authService';

interface AuthContextData {
  user: AuthResponse | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (email: string, name: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('@iFoodClone:user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const isValid = await authService.validateToken();
          
          if (isValid) {
            setUser(userData);
          } else {
            authService.handleLogout();
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.handleLogout();
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  const saveUserAndToken = useCallback((userData: AuthResponse) => {
    localStorage.setItem('@iFoodClone:user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    setUser(userData);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      saveUserAndToken(response);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveUserAndToken, navigate]);

  const loginWithGoogle = useCallback(async (email: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await authService.loginWithGoogle(email, name);
      saveUserAndToken(response);
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveUserAndToken, navigate]);

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register(name, email, password, phone);
      saveUserAndToken(response);
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveUserAndToken, navigate]);

  const logout = useCallback(() => {
    authService.handleLogout();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, isLoading }}>
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