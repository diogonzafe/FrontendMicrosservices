import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getRestaurantById, updateRestaurant } from '../services/restaurantService';
import { RestaurantDTO } from '../types/restaurant';

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

const RestaurantEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantDTO | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [complement, setComplement] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getRestaurantById(Number(id));
          setRestaurant(data);
          setName(data.name);
          setCategory(data.category || '');
          setStreet(data.address.street);
          setNumber(data.address.number);
          setCity(data.address.city);
          setState(data.address.state);
          setNeighborhood(data.address.neighborhood);
          setZipcode(data.address.zipcode);
          setComplement(data.address.complement || '');
        }
      } catch (err) {
        setError('Failed to load restaurant data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !street || !number || !city || !state || !neighborhood || !zipcode) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (restaurant && restaurant.id) {
        const updatedRestaurant: RestaurantDTO = {
          ...restaurant,
          name,
          category,
          address: {
            street,
            number,
            city,
            state,
            neighborhood,
            zipcode,
            complement
          }
        };
        await updateRestaurant(restaurant.id, updatedRestaurant);
        navigate('/restaurants');
      }
    } catch (err) {
      setError('Failed to update restaurant. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error && !restaurant) {
    return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  }

  return (
    <Container>
      <Title>Editar Restaurante</Title>
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
          <Label>Categoria:</Label>
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>Rua:</Label>
          <Input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Número:</Label>
          <Input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Cidade:</Label>
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Estado:</Label>
          <Input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Bairro:</Label>
          <Input
            type="text"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>CEP:</Label>
          <Input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Complemento:</Label>
          <Input
            type="text"
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
          />
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Salvar Alterações</Button>
      </Form>
    </Container>
  );
};

export default RestaurantEdit;
