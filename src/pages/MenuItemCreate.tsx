import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { createMenuItem } from '../services/restaurantService';
import { MenuItemDTO } from '../types/restaurant';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 100px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    background-color: #cc0000;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

const MenuItemCreate: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItem, setMenuItem] = useState<MenuItemDTO>({
    restaurantId: Number(restaurantId),
    name: '',
    description: '',
    price: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMenuItem(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuItem.name || !menuItem.price) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (restaurantId) {
        const restaurantIdNum = Number(restaurantId);
        await createMenuItem(restaurantIdNum, {
          restaurantId: restaurantIdNum,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price
        });
        navigate('/restaurants');
      } else {
        setError('Invalid restaurant ID');
      }
    } catch (err) {
      setError('Failed to create menu item. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h2>Create Menu Item</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={menuItem.name}
          onChange={handleChange}
          required
        />
        <TextArea
          name="description"
          placeholder="Description"
          value={menuItem.description}
          onChange={handleChange}
        />
        <Input
          type="number"
          name="price"
          placeholder="Price"
          value={menuItem.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Menu Item'}
        </Button>
      </Form>
    </Container>
  );
};

export default MenuItemCreate;
