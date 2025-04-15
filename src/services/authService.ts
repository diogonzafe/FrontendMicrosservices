import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface AuthResponse {
  name: string;
  token: string;
  email: string;
  phone: string | null;
  address: any | null;
  id: number;
}

// Configuração global do axios
axios.defaults.withCredentials = true;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

const authService = {
  async sendVerificationCode(email: string): Promise<string> {
    try {
      const response = await axiosInstance.post('/users/send-code', email);
      return response.data;
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  },

  async verifyCode(email: string, code: string): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post('/users/verify-code', { email, code });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await axiosInstance.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('@iFoodClone:user');
  }
};

// Interceptor para adicionar o token em todas as requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authService.handleLogout();
    }
    return Promise.reject(error);
  }
);

export default authService;
