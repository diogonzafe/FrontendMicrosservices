import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMenuItemById, updateMenuItem } from '../services/restaurantService';
import { MenuItemDTO } from '../types/restaurant';

const Container = styled.div`
  padding: 24px;
  max-width: 800px;
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

const Form = styled.form`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  border: 1px solid #f0f0f0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #f9f9f9;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #ea1d2c;
    box-shadow: 0 0 0 3px rgba(234, 29, 44, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #f9f9f9;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #ea1d2c;
    box-shadow: 0 0 0 3px rgba(234, 29, 44, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #ea1d2c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(234, 29, 44, 0.2);
  margin-top: 16px;

  &:hover {
    background-color: #c8101e;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(234, 29, 44, 0.3);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const MenuItemEdit: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId, id } = useParams<{ restaurantId: string, id: string }>();
  const [menuItem, setMenuItem] = useState<MenuItemDTO | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await getMenuItemById(Number(id));
          setMenuItem(data);
          setName(data.name);
          setDescription(data.description || '');
          setPrice(data.price.toString());
        }
      } catch (err) {
        setError('Falha ao carregar dados do item do menu. Por favor, tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);

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
        setError('ID do item do menu ou restaurante inválido');
      }
    } catch (err) {
      setError('Falha ao atualizar item do menu. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading && !menuItem) {
    return <LoadingOverlay>Carregando dados do item do menu...</LoadingOverlay>;
  }

  if (error && !menuItem) {
    return (
      <Container>
        <Header>
          <Title>Editar Item de Menu</Title>
          <BackButton onClick={handleBack}>Voltar</BackButton>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Editar Item de Menu</Title>
        <BackButton onClick={handleBack}>Voltar</BackButton>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Nome do Item</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do item"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Descrição</Label>
          <TextArea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição do item"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Digite o preço do item"
            step="0.01"
            min="0"
            required
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default MenuItemEdit;
