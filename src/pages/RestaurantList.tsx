import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAllRestaurants, deleteRestaurant } from '../services/restaurantService';
import { RestaurantDTO } from '../types/restaurant';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #cc0000;
  }
`;

const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const RestaurantCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RestaurantName = styled.h3`
  margin: 0;
  color: #333;
`;

const RestaurantInfo = styled.p`
  margin: 0;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &.edit {
    background-color: #ffa500;
    color: white;
  }

  &.delete {
    background-color: #ff6347;
    color: white;
  }

  &.menu {
    background-color: #4caf50;
    color: white;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin: 20px 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #666;
`;

const EmptyMessage = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #666;
`;

const RestaurantList: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<RestaurantDTO[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getAllRestaurants();
        setRestaurants(data);

        // Get ownerId from localStorage
        const userDataStr = localStorage.getItem('user_data');
        let ownerId = 1; // Default fallback
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            if (userData && userData.id) {
              ownerId = userData.id;
            } else if (userData && userData.user && userData.user.id) {
              ownerId = userData.user.id;
            }
          } catch (parseError) {
            console.error('Error parsing user_data from localStorage:', parseError);
          }
        }

        // Filter restaurants by ownerId
        const userRestaurants = data.filter(restaurant => restaurant.ownerId === ownerId);
        setFilteredRestaurants(userRestaurants);
      } catch (err) {
        setError('Failed to load restaurants. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleAddRestaurant = () => {
    navigate('/restaurant/create');
  };

  const handleEdit = (id: number) => {
    navigate(`/restaurants/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await deleteRestaurant(id);
        setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
        setFilteredRestaurants(filteredRestaurants.filter(restaurant => restaurant.id !== id));
      } catch (err) {
        setError('Failed to delete restaurant. Please try again.');
        console.error(err);
      }
    }
  };

  const handleManageMenu = (id: number) => {
    navigate(`/restaurants/${id}/menu-items`);
  };

  const handleCreateMenuItem = (id: number) => {
    navigate(`/restaurants/${id}/menu-items/create`);
  };

  if (loading) {
    return <LoadingMessage>Loading restaurants...</LoadingMessage>;
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Meus Restaurantes</Title>
          <Button onClick={handleAddRestaurant}>Adicionar Restaurante</Button>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (filteredRestaurants.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Meus Restaurantes</Title>
          <Button onClick={handleAddRestaurant}>Adicionar Restaurante</Button>
        </Header>
        <EmptyMessage>You don't have any restaurants yet. Click "Adicionar Restaurante" to create one.</EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Meus Restaurantes</Title>
        <Button onClick={handleAddRestaurant}>Adicionar Restaurante</Button>
      </Header>
      <RestaurantGrid>
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id}>
            <RestaurantName>{restaurant.name}</RestaurantName>
            <RestaurantInfo>Categoria: {restaurant.category || 'N/A'}</RestaurantInfo>
            <RestaurantInfo>
              {restaurant.address.street}, {restaurant.address.number} - {restaurant.address.city}
            </RestaurantInfo>
            <ActionButtons>
              <ActionButton className="edit" onClick={() => handleEdit(restaurant.id || 0)}>
                Editar
              </ActionButton>
              <ActionButton className="delete" onClick={() => handleDelete(restaurant.id || 0)}>
                Excluir
              </ActionButton>
              <ActionButton className="menu" onClick={() => handleCreateMenuItem(restaurant.id || 0)}>
                Adicionar Item ao Menu
              </ActionButton>
            </ActionButtons>
            <ActionButton className="menu" onClick={() => handleManageMenu(restaurant.id || 0)}>
              Gerenciar Menu
            </ActionButton>
          </RestaurantCard>
        ))}
      </RestaurantGrid>
    </Container>
  );
};

export default RestaurantList;
