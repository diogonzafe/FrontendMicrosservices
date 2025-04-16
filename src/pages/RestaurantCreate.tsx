import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RestaurantDTO, AddressDTO } from '../types/restaurant';

import { createRestaurant, setAuthToken } from '../services/restaurantService';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #EA1D2C;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #c81a25;
  }
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RestaurantCreate: React.FC = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantDTO>({
    name: '',
    address: {
      street: '',
      number: '',
      city: '',
      neighborhood: '',
      state: '',
      zipcode: '',
      complement: ''
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get token from local storage if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    setAuthToken(token);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setRestaurant(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setRestaurant(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Get user ID from local storage if available
      const userDataStr = localStorage.getItem('user_data');
      let ownerId = 1; // Default fallback if no user data is found
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          if (userData && userData.id) {
            ownerId = userData.id;
          } else if (userData && userData.user && userData.user.id) {
            ownerId = userData.user.id; // Handle nested structure if it exists
          }
        } catch (parseError) {
          console.error('Error parsing user_data from localStorage:', parseError);
        }
      }
      const restaurantToSubmit = { ...restaurant, ownerId };
      console.log('Submitting restaurant with data:', restaurantToSubmit);
      const response = await createRestaurant(restaurantToSubmit);
      navigate(`/restaurants/${response.id}/menu-items/create`);
    } catch (err) {
      setError('Failed to create restaurant. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Create New Restaurant</Title>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Restaurant Name</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={restaurant.name}
            onChange={handleChange}
            required
            placeholder="Enter restaurant name"
          />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <Input
            type="text"
            id="category"
            name="category"
            value={restaurant.category || ''}
            onChange={handleChange}
            placeholder="Enter restaurant category"
          />
        </div>
        <FieldGroup>
          <label>Address</label>
          <Input
            type="text"
            name="address.street"
            value={restaurant.address.street}
            onChange={handleChange}
            required
            placeholder="Street"
          />
          <Input
            type="text"
            name="address.number"
            value={restaurant.address.number}
            onChange={handleChange}
            required
            placeholder="Number"
          />
          <Input
            type="text"
            name="address.neighborhood"
            value={restaurant.address.neighborhood}
            onChange={handleChange}
            required
            placeholder="Neighborhood"
          />
          <Input
            type="text"
            name="address.city"
            value={restaurant.address.city}
            onChange={handleChange}
            required
            placeholder="City"
          />
          <Input
            type="text"
            name="address.state"
            value={restaurant.address.state}
            onChange={handleChange}
            required
            placeholder="State"
          />
          <Input
            type="text"
            name="address.zipcode"
            value={restaurant.address.zipcode}
            onChange={handleChange}
            required
            placeholder="Zipcode"
          />
          <Input
            type="text"
            name="address.complement"
            value={restaurant.address.complement || ''}
            onChange={handleChange}
            placeholder="Complement (optional)"
          />
        </FieldGroup>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Restaurant'}
        </Button>
      </Form>
    </Container>
  );
};

export default RestaurantCreate;
