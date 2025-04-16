import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createRestaurant } from '../services/restaurantService';

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

const CategorySelect = styled.select`
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

const RestaurantCreate: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !street || !number || !neighborhood || !city || !state) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
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

      const restaurantData = {
        name,
        ownerId,
        category,
        address: {
          street,
          number,
          neighborhood,
          city,
          state,
          zipcode: '',
          complement: ''
        }
      };

      console.log('Submitting restaurant with data:', restaurantData);
      const createdRestaurant = await createRestaurant(restaurantData);
      navigate(`/restaurants/${createdRestaurant.id}/menu-items/create`);
    } catch (err) {
      setError('Falha ao criar restaurante. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/restaurants');
  };

  return (
    <Container>
      <Header>
        <Title>Criar Restaurante</Title>
        <BackButton onClick={handleBack}>Voltar</BackButton>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Nome do Restaurante</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do restaurante"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Categoria</Label>
          <CategorySelect
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="Brasileira">Brasileira</option>
            <option value="Italiana">Italiana</option>
            <option value="Japonesa">Japonesa</option>
            <option value="Chinesa">Chinesa</option>
            <option value="Pizza">Pizza</option>
            <option value="Hamburguer">Hamburguer</option>
            <option value="Doces e Sobremesas">Doces e Sobremesas</option>
            <option value="Vegana">Vegana</option>
            <option value="Árabe">Árabe</option>
            <option value="Mexicana">Mexicana</option>
            <option value="Café">Café</option>
            <option value="Lanches">Lanches</option>
            <option value="Padaria">Padaria</option>
            <option value="Mercado">Mercado</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Outra">Outra</option>
          </CategorySelect>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="street">Rua</Label>
          <Input
            type="text"
            id="street"
            name="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Digite o nome da rua"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="number">Número</Label>
          <Input
            type="text"
            id="number"
            name="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Digite o número"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            type="text"
            id="neighborhood"
            name="neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Digite o bairro"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="city">Cidade</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Digite a cidade"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="state">Estado</Label>
          <Input
            type="text"
            id="state"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Digite o estado"
            required
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Restaurante'}
        </SubmitButton>
      </Form>

      {isLoading && <LoadingOverlay>Carregando...</LoadingOverlay>}
    </Container>
  );
};

export default RestaurantCreate;
