import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMenuItemsByRestaurantId, deleteMenuItem } from '../services/restaurantService';
import { MenuItemDTO } from '../types/restaurant';

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

const MenuItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const MenuItemCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuItemName = styled.h3`
  margin: 0;
  color: #333;
`;

const MenuItemInfo = styled.p`
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

const MenuItemList: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        if (restaurantId) {
          const data = await getMenuItemsByRestaurantId(Number(restaurantId));
          setMenuItems(data);
        }
      } catch (err) {
        setError('Failed to load menu items. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const handleAddMenuItem = () => {
    navigate(`/restaurants/${restaurantId}/menu-items/create`);
  };

  const handleEdit = (id: number) => {
    navigate(`/restaurants/${restaurantId}/menu-items/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(id);
        setMenuItems(menuItems.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete menu item. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <LoadingMessage>Loading menu items...</LoadingMessage>;
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Menu Items</Title>
          <Button onClick={handleAddMenuItem}>Adicionar Item ao Menu</Button>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (menuItems.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Menu Items</Title>
          <Button onClick={handleAddMenuItem}>Adicionar Item ao Menu</Button>
        </Header>
        <EmptyMessage>This restaurant doesn't have any menu items yet. Click "Adicionar Item ao Menu" to create one.</EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Menu Items</Title>
        <Button onClick={handleAddMenuItem}>Adicionar Item ao Menu</Button>
      </Header>
      <MenuItemGrid>
        {menuItems.map(item => (
          <MenuItemCard key={item.id}>
            <MenuItemName>{item.name}</MenuItemName>
            <MenuItemInfo>{item.description}</MenuItemInfo>
            <MenuItemInfo>Price: R${item.price.toFixed(2)}</MenuItemInfo>
            <ActionButtons>
              <ActionButton className="edit" onClick={() => handleEdit(item.id || 0)}>
                Editar
              </ActionButton>
              <ActionButton className="delete" onClick={() => handleDelete(item.id || 0)}>
                Excluir
              </ActionButton>
            </ActionButtons>
          </MenuItemCard>
        ))}
      </MenuItemGrid>
    </Container>
  );
};

export default MenuItemList;
