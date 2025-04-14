import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
} from '@mui/material';
import api from '../services/api';
import axios from 'axios';

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

interface AddressFormProps {
  userId: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ userId }) => {
  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipcode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log('AddressForm - UserId:', userId);
    console.log('AddressForm - API URL:', import.meta.env.VITE_API_URL);
    fetchAddress();
  }, [userId]);

  const fetchAddress = async () => {
    try {
      console.log('AddressForm - Fetching address for user:', userId);
      const response = await api.get(`/users/${userId}/address`);
      console.log('AddressForm - Address data:', response.data);
      if (response.data) {
        setAddress(response.data);
      }
    } catch (error) {
      console.error('AddressForm - Error fetching address:', error);
      if (axios.isAxiosError(error)) {
        console.error('AddressForm - Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('AddressForm - Submitting address:', address);
      console.log('AddressForm - API URL:', import.meta.env.VITE_API_URL);
      console.log('AddressForm - Request URL:', `/users/${userId}/address`);
      
      const response = await api.put(`/users/${userId}/address`, address);
      console.log('AddressForm - Update response:', response.data);
      setSuccess('Endereço atualizado com sucesso!');
    } catch (error) {
      console.error('AddressForm - Error updating address:', error);
      if (axios.isAxiosError(error)) {
        console.error('AddressForm - Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
        });
        setError(error.response?.data?.message || 'Erro ao atualizar endereço. Tente novamente.');
      } else {
        setError('Erro ao atualizar endereço. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Seu Endereço
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Rua"
              name="street"
              value={address.street}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Número"
              name="number"
              value={address.number}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Complemento"
              name="complement"
              value={address.complement}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bairro"
              name="neighborhood"
              value={address.neighborhood}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cidade"
              name="city"
              value={address.city}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estado"
              name="state"
              value={address.state}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CEP"
              name="zipcode"
              value={address.zipcode}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 9 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Endereço'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddressForm; 