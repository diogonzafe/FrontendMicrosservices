import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.status === 200;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

export const register = async (userData: any) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const updateUser = async (userData: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await axios.put(`${API_URL}/users/me`, userData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

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
