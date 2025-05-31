import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  TextField,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  Checkbox
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Order: React.FC = () => {
  const { cart, confirmOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addressOption, setAddressOption] = useState('saved');
  const [savedAddress, setSavedAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [error, setError] = useState('');
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  
  // Campos do formulário de endereço
  const [addressForm, setAddressForm] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipcode: ''
  });

  useEffect(() => {
    // Buscar endereço do perfil do usuário
    const fetchUserAddress = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.address) {
          // Se o endereço é um objeto, formatar corretamente
          const addr = response.data.address;
          let formattedAddress = '';
          
          if (typeof addr === 'object') {
            formattedAddress = [
              addr.street && addr.number ? `${addr.street}, ${addr.number}` : '',
              addr.complement,
              addr.neighborhood,
              addr.city && addr.state ? `${addr.city} - ${addr.state}` : '',
              addr.zipcode
            ].filter(part => part).join(', ');
          } else if (typeof addr === 'string') {
            formattedAddress = addr;
          }
          
          if (formattedAddress) {
            setSavedAddress(formattedAddress);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
      }
    };

    if (user) {
      fetchUserAddress();
    }
  }, [user]);

  const handleAddressChange = (field: string, value: string) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const formatAddress = () => {
    const { street, number, complement, neighborhood, city, state, zipcode } = addressForm;
    const parts = [
      street && number ? `${street}, ${number}` : '',
      complement,
      neighborhood,
      city && state ? `${city} - ${state}` : '',
      zipcode
    ].filter(part => part);
    
    return parts.join(', ');
  };

  const handleConfirmOrder = async () => {
    let deliveryAddress = '';
    
    if (addressOption === 'saved') {
      deliveryAddress = savedAddress;
    } else if (addressOption === 'new') {
      deliveryAddress = newAddress;
    } else if (addressOption === 'form') {
      // Validar campos obrigatórios
      if (!addressForm.street || !addressForm.number || !addressForm.neighborhood || 
          !addressForm.city || !addressForm.state || !addressForm.zipcode) {
        setError('Por favor, preencha todos os campos obrigatórios do endereço.');
        return;
      }
      deliveryAddress = formatAddress();
      
      // Salvar endereço se o usuário marcou a opção
      if (saveNewAddress && user?.id) {
        try {
          const token = localStorage.getItem('authToken');
          await axios.put('/api/users/address', 
            { 
              address: {
                street: addressForm.street,
                number: addressForm.number,
                complement: addressForm.complement,
                neighborhood: addressForm.neighborhood,
                city: addressForm.city,
                state: addressForm.state,
                zipcode: addressForm.zipcode
              }
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Erro ao salvar endereço:', error);
        }
      }
    }
    
    if (!deliveryAddress.trim()) {
      setError('Por favor, forneça um endereço de entrega.');
      return;
    }

    // Salva o pedido com o endereço
    confirmOrder(deliveryAddress);
    navigate('/invoice');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Confirmação de Pedido
      </Typography>
      
      {/* Resumo do Pedido */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Itens do Pedido
        </Typography>
        <List>
          {cart.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={item.name} secondary={`R$ ${item.price.toFixed(2)}`} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total: R$ {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
        </Typography>
      </Paper>

      {/* Endereço de Entrega */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Endereço de Entrega
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <FormControl component="fieldset">
          <RadioGroup
            value={addressOption}
            onChange={(e) => setAddressOption(e.target.value)}
          >
            {savedAddress && (
              <FormControlLabel
                value="saved"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">Usar endereço cadastrado:</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {savedAddress}
                    </Typography>
                  </Box>
                }
              />
            )}
            <FormControlLabel
              value="new"
              control={<Radio />}
              label="Digitar endereço manualmente"
            />
            {!savedAddress && (
              <FormControlLabel
                value="form"
                control={<Radio />}
                label="Cadastrar novo endereço"
              />
            )}
          </RadioGroup>
        </FormControl>

        {addressOption === 'new' && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Endereço de entrega"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Digite o endereço completo para entrega"
            sx={{ mt: 2 }}
          />
        )}

        {addressOption === 'form' && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Rua"
                  value={addressForm.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Número"
                  value={addressForm.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Complemento"
                  value={addressForm.complement}
                  onChange={(e) => handleAddressChange('complement', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bairro"
                  value={addressForm.neighborhood}
                  onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={addressForm.zipcode}
                  onChange={(e) => handleAddressChange('zipcode', e.target.value)}
                  placeholder="00000-000"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={addressForm.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Estado"
                  value={addressForm.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="Ex: SP"
                  required
                />
              </Grid>
            </Grid>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={saveNewAddress} 
                  onChange={(e) => setSaveNewAddress(e.target.checked)}
                />
              }
              label="Salvar este endereço para próximas compras"
              sx={{ mt: 2 }}
            />
          </Box>
        )}

        {!savedAddress && addressOption === 'saved' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Você não possui endereço cadastrado. Por favor, selecione uma das outras opções.
          </Alert>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/shopping-cart')}>
          Voltar
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirmOrder}>
          Confirmar Pedido
        </Button>
      </Box>
    </Box>
  );
};

export default Order; 