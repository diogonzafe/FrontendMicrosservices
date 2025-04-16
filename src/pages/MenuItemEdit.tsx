import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMenuItemById, updateMenuItem } from '../services/restaurantService';
import { MenuItemDTO } from '../types/restaurant';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
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
  min-height: 100px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #cc0000;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

const MenuItemEdit: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId, id } = useParams<{ restaurantId: string, id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItemDTO | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getMenuItemById(Number(id));
          setMenuItem(data);
          setName(data.name);
          setDescription(data.description || '');
          setPrice(data.price.toString());
        }
      } catch (err) {
        setError('Failed to load menu item data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (menuItem && menuItem.id && restaurantId) {
        const updatedMenuItem: MenuItemDTO = {
          ...menuItem,
          name,
          description,
          price: parseFloat(price)
        };
        await updateMenuItem(menuItem.id, updatedMenuItem);
        navigate(`/restaurants/${restaurantId}/menu-items`);
      } else {
        setError('Invalid menu item or restaurant ID');
      }
    } catch (err) {
      setError('Failed to update menu item. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error && !menuItem) {
    return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  }

  return (
    <Container>
      <Title>Editar Item do Menu</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Nome:</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Descrição:</Label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>Preço (R$):</Label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Salvar Alterações</Button>
      </Form>
    </Container>
  );
};

export default MenuItemEdit;
