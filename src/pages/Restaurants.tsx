import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAllRestaurants, deleteRestaurant } from '../services/restaurantService';
import { RestaurantDTO } from '../types/restaurant';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eaeaea;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #ea1d2c;
  margin: 0;
  position: relative;
  padding-left: 16px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    height: 28px;
    width: 4px;
    background-color: #ea1d2c;
    border-radius: 0 4px 4px 0;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #ea1d2c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #c8101e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(234, 29, 44, 0.2);
  }
`;

const BackToMenuButton = styled.button`
  padding: 12px 24px;
  background-color: transparent;
  color: #ea1d2c;
  border: 2px solid #ea1d2c;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: rgba(234, 29, 44, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(234, 29, 44, 0.1);
  }
`;

const RestaurantList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const RestaurantCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const RestaurantImage = styled.div`
  width: 100%;
  height: 160px;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #999;
`;

const RestaurantName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const RestaurantDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const RestaurantActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 0;
  background-color: transparent;
  color: #ea1d2c;
  border: 2px solid #ea1d2c;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: rgba(234, 29, 44, 0.05);
    transform: translateY(-2px);
  }

  &.edit {
    border-color: #f39c12;
    color: #f39c12;

    &:hover {
      background-color: rgba(243, 156, 18, 0.05);
    }
  }

  &.delete {
    border-color: #e74c3c;
    color: #e74c3c;

    &:hover {
      background-color: rgba(231, 76, 60, 0.05);
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-size: 16px;
  color: #666;
  margin-top: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 48px;
  background-color: #fff5f5;
  color: #ea1d2c;
  border-radius: 16px;
  margin-top: 24px;
  border: 1px solid #ffe0e0;
`;

const ErrorText = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

const Restaurants: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<RestaurantDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError('Erro ao carregar restaurantes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleCreateRestaurant = () => {
    navigate('/restaurant/create');
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const handleEditRestaurant = (id: number) => {
    navigate(`/restaurants/edit/${id}`);
  };

  const handleViewMenu = (restaurantId: number) => {
    navigate(`/restaurants/${restaurantId}/menu-items`);
  };

  const handleDeleteRestaurant = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este restaurante? Esta ação não pode ser desfeita.')) {
      try {
        await deleteRestaurant(id);
        setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
      } catch (err) {
        setError('Falha ao excluir restaurante. Por favor, tente novamente.');
        console.error(err);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Meus Restaurantes</Title>
        <div style={{ display: 'flex', gap: '16px' }}>
          <BackToMenuButton onClick={handleBackToMenu}>Voltar ao Menu Principal</BackToMenuButton>
          <Button onClick={handleCreateRestaurant}>Criar Restaurante</Button>
        </div>
      </Header>

      {loading ? (
        <LoadingContainer>
          <div>Carregando...</div>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      ) : restaurants.length === 0 ? (
        <EmptyMessage>
          Nenhum restaurante cadastrado
        </EmptyMessage>
      ) : (
        <RestaurantList>
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id}>
              <RestaurantImage>🍴</RestaurantImage>
              <RestaurantName>{restaurant.name}</RestaurantName>
              <RestaurantDescription>{restaurant.address?.street || 'Descrição não disponível'}</RestaurantDescription>
              <RestaurantActions>
                <ActionButton onClick={() => handleViewMenu(restaurant.id ?? 0)}>Ver Menu</ActionButton>
                <ActionButton className="edit" onClick={() => handleEditRestaurant(restaurant.id ?? 0)}>Editar</ActionButton>
                <ActionButton className="delete" onClick={() => handleDeleteRestaurant(restaurant.id ?? 0)}>Excluir</ActionButton>
              </RestaurantActions>
            </RestaurantCard>
          ))}
        </RestaurantList>
      )}
    </Container>
  );
};

export default Restaurants;
