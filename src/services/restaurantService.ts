import axios from 'axios';
import { RestaurantDTO, MenuItemDTO } from '../types/restaurant';

const API_URL = '/api/restaurants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Remove auth token
export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export const createRestaurant = async (restaurant: RestaurantDTO): Promise<RestaurantDTO> => {
  console.log('Attempting to create restaurant with data:', restaurant);
  const response = await api.post('', restaurant);
  console.log('Response from API:', response.data);
  return response.data;
};

export const getAllRestaurants = async (): Promise<RestaurantDTO[]> => {
  console.log('Attempting to get all restaurants');
  const response = await api.get('');
  console.log('Response from API:', response.data);
  return response.data;
};

export const getRestaurantById = async (id: number): Promise<RestaurantDTO> => {
  console.log('Attempting to get restaurant by id:', id);
  const response = await api.get(`/${id}`);
  console.log('Response from API:', response.data);
  return response.data;
};

export const updateRestaurant = async (id: number, restaurant: RestaurantDTO): Promise<RestaurantDTO> => {
  console.log('Attempting to update restaurant with id:', id, 'and data:', restaurant);
  const response = await api.put(`/${id}`, restaurant);
  console.log('Response from API:', response.data);
  return response.data;
};

export const deleteRestaurant = async (id: number): Promise<void> => {
  console.log('Attempting to delete restaurant with id:', id);
  await api.delete(`/${id}`);
};

export const createMenuItem = async (restaurantId: number, menuItem: MenuItemDTO): Promise<MenuItemDTO> => {
  console.log('Attempting to create menu item for restaurant with id:', restaurantId, 'and data:', menuItem);
  const response = await api.post(`/${restaurantId}/menu-items`, menuItem);
  console.log('Response from API:', response.data);
  return response.data;
};

export const getMenuItemsByRestaurantId = async (restaurantId: number): Promise<MenuItemDTO[]> => {
  console.log('Attempting to get menu items for restaurant with id:', restaurantId);
  const response = await api.get(`/${restaurantId}/menu-items`);
  console.log('Response from API:', response.data);
  return response.data;
};

export const getMenuItemById = async (id: number): Promise<MenuItemDTO> => {
  console.log('Attempting to get menu item by id:', id);
  const response = await api.get(`/menu-items/${id}`);
  console.log('Response from API:', response.data);
  return response.data;
};

export const updateMenuItem = async (id: number, menuItem: MenuItemDTO): Promise<MenuItemDTO> => {
  console.log('Attempting to update menu item with id:', id, 'and data:', menuItem);
  const response = await api.put(`/menu-items/${id}`, menuItem);
  console.log('Response from API:', response.data);
  return response.data;
};

export const deleteMenuItem = async (id: number): Promise<void> => {
  console.log('Attempting to delete menu item with id:', id);
  await api.delete(`/menu-items/${id}`);
};
