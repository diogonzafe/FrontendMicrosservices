import { axiosInstance } from './authService';
import { AxiosError } from 'axios';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface UserProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: Address | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Configuração do axios com CORS
axiosInstance.defaults.withCredentials = true;

const getAuthToken = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user.token;
  } catch {
    return null;
  }
};

const userService = {
  async getUserProfile(userId: number): Promise<UserProfileData> {
    try {
      const token = getAuthToken();
      const response = await axiosInstance.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async updateProfile(userId: number, data: Partial<UserProfileData>): Promise<UserProfileData> {
    try {
      const token = getAuthToken();
      const response = await axiosInstance.put(`/users/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async deleteAccount(userId: number): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axiosInstance.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  async getAddress(userId: number): Promise<Address | null> {
    try {
      const token = getAuthToken();
      const response = await axiosInstance.get(`/users/${userId}/address`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      console.error('Error getting address:', error);
      throw error;
    }
  },

  async updateAddress(userId: number, address: Address): Promise<{ message: string }> {
    try {
      const token = getAuthToken();
      const response = await axiosInstance.put(`/users/${userId}/address`, {
        street: address.street,
        number: address.number,
        complement: address.complement || '',
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipcode: address.zipcode
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  async deleteAddress(userId: number): Promise<{ message: string }> {
    try {
      const token = getAuthToken();
      const response = await axiosInstance.delete(`/users/${userId}/address`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }
};

export default userService;
