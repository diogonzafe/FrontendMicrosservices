import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMenuItemsByRestaurantId, deleteMenuItem } from '../services/restaurantService';
import { MenuItemDTO } from '../types/restaurant';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #fff5f5, #ffffff);
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

const BackButton = styled.button`
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

const MenuItemListStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const MenuItemCard = styled.div`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(234, 29, 44, 0.1);
  }
`;

const MenuItemImage = styled.div`
  width: 100%;
  height: 160px;
  background-color: #e0e0e0;
  background-image: url('https://via.placeholder.com/320x160?text=Item+do+Menu');
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid #eee;
`;

const MenuItemContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MenuItemName = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 700;
`;

const MenuItemDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const MenuItemPrice = styled.div`
  font-size: 18px;
  color: #ea1d2c;
  font-weight: 700;
  margin-top: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding: 0 20px 20px 20px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: white;
  transition: background-color 0.2s, transform 0.2s;

  &.edit {
    background-color: #ffa500;

    &:hover {
      background-color: #e08600;
      transform: translateY(-2px);
    }
  }

  &.delete {
    background-color: #ff6347;

    &:hover {
      background-color: #e0414e;
      transform: translateY(-2px);
    }
  }
`;

const ErrorMessage = styled.div`
  margin: 20px 0;
  padding: 12px 16px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin: 30px 0;
  color: #666;
  font-size: 16px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  margin: 30px 0;
  color: #666;
  font-size: 16px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const MenuItemList: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate('/restaurants');
  };

  const handleAddMenuItem = () => {
    if (restaurantId) {
      navigate(`/restaurants/${restaurantId}/menu-items/create`);
    }
  };

  const handleEditMenuItem = (id: number) => {
    if (restaurantId) {
      navigate(`/restaurants/${restaurantId}/menu-items/edit/${id}`);
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este item do menu? Esta ação não pode ser desfeita.')) {
      try {
        await deleteMenuItem(id);
        setMenuItems(menuItems.filter(item => item.id !== id));
      } catch (err) {
        setError('Falha ao excluir item do menu. Por favor, tente novamente.');
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        if (restaurantId) {
          const data = await getMenuItemsByRestaurantId(Number(restaurantId));
          setMenuItems(data);
        }
      } catch (err) {
        setError('Falha ao carregar itens do menu. Por favor, tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  if (loading) {
    return <LoadingMessage>Carregando itens do menu...</LoadingMessage>;
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Menu do Restaurante</Title>
          <div>
            <BackButton onClick={handleBack}>Voltar</BackButton>
            <Button onClick={handleAddMenuItem}>Adicionar Item ao Menu</Button>
          </div>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (menuItems.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Menu do Restaurante</Title>
          <div>
            <BackButton onClick={handleBack}>Voltar</BackButton>
            <Button onClick={handleAddMenuItem}>Adicionar Item ao Menu</Button>
          </div>
        </Header>
        <EmptyMessage>Este restaurante ainda não tem itens no menu. Clique em "Adicionar Item ao Menu" para criar o primeiro!</EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Menu do Restaurante</Title>
        <div>
          <BackButton onClick={handleBack}>Voltar</BackButton>
          <Button onClick={handleAddMenuItem}>Adicionar Item ao Menu</Button>
        </div>
      </Header>
      <MenuItemListStyled>
        {menuItems.map(item => (
          <MenuItemCard key={item.id}>
            <MenuItemImage />
            <MenuItemContent>
              <MenuItemName>{item.name}</MenuItemName>
              <MenuItemDescription>{item.description || 'Sem descrição disponível'}</MenuItemDescription>
              <MenuItemPrice>R$ {item.price.toFixed(2)}</MenuItemPrice>
            </MenuItemContent>
            <ActionButtons>
              <ActionButton className="edit" onClick={() => handleEditMenuItem(item.id || 0)}>
                Editar
              </ActionButton>
              <ActionButton className="delete" onClick={() => handleDeleteMenuItem(item.id || 0)}>
                Excluir
              </ActionButton>
            </ActionButtons>
          </MenuItemCard>
        ))}
      </MenuItemListStyled>
    </Container>
  );
};

export default MenuItemList;
