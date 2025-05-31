import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Badge,
  Tooltip,
  Paper
} from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const steps = ['Carrinho', 'Endereço', 'Confirmação', 'Nota Fiscal'];

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddressChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [field]: event.target.value });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleFinishOrder = () => {
    // Gerar número do pedido (exemplo: timestamp + random)
    const newOrderNumber = `PED${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setOrderNumber(newOrderNumber);
    handleNext();
  };

  const renderCartStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Seu Carrinho
      </Typography>
      <List>
        {cart.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => removeFromCart(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={item.name}
              secondary={`R$ ${item.price.toFixed(2)}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">R$ {calculateTotal().toFixed(2)}</Typography>
      </Box>
      <Button
        variant="contained"
        fullWidth
        onClick={handleNext}
        disabled={cart.length === 0}
      >
        Continuar
      </Button>
    </Box>
  );

  const renderAddressStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Endereço de Entrega
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="CEP"
            value={address.zipCode}
            onChange={handleAddressChange('zipCode')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Rua"
            value={address.street}
            onChange={handleAddressChange('street')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Número"
            value={address.number}
            onChange={handleAddressChange('number')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Complemento"
            value={address.complement}
            onChange={handleAddressChange('complement')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bairro"
            value={address.neighborhood}
            onChange={handleAddressChange('neighborhood')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Cidade"
            value={address.city}
            onChange={handleAddressChange('city')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Estado"
            value={address.state}
            onChange={handleAddressChange('state')}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={handleBack}>
          Voltar
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleNext}
          disabled={!address.street || !address.number || !address.neighborhood}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );

  const renderConfirmationStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Confirmação do Pedido
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Itens do Pedido
          </Typography>
          <List>
            {cart.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={item.name}
                  secondary={`R$ ${item.price.toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">R$ {calculateTotal().toFixed(2)}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Endereço de Entrega
          </Typography>
          <Typography>
            {address.street}, {address.number}
            {address.complement && ` - ${address.complement}`}
          </Typography>
          <Typography>
            {address.neighborhood}, {address.city} - {address.state}
          </Typography>
          <Typography>CEP: {address.zipCode}</Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={handleBack}>
          Voltar
        </Button>
        <Button variant="contained" fullWidth onClick={handleFinishOrder}>
          Finalizar Pedido
        </Button>
      </Box>
    </Box>
  );

  const renderInvoiceStep = () => (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Nota Fiscal do Pedido
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Número do Pedido: {orderNumber}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Data: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Detalhes do Pedido
        </Typography>
        <List>
          {cart.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.name}
                secondary={`R$ ${item.price.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Subtotal:</Typography>
          <Typography variant="h6">R$ {calculateTotal().toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body1">Taxa de Entrega:</Typography>
          <Typography variant="body1">R$ 5.00</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">R$ {(calculateTotal() + 5).toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Endereço de Entrega
        </Typography>
        <Typography>
          {address.street}, {address.number}
          {address.complement && ` - ${address.complement}`}
        </Typography>
        <Typography>
          {address.neighborhood}, {address.city} - {address.state}
        </Typography>
        <Typography>CEP: {address.zipCode}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Informações Adicionais
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • O pedido será preparado assim que confirmado pelo restaurante
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • O tempo estimado de entrega é de 30-45 minutos
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Você receberá atualizações sobre o status do seu pedido
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              clearCart();
              navigate('/menu');
            }}
          >
            Voltar ao Menu
          </Button>
        </Box>
      </Paper>
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderCartStep();
      case 1:
        return renderAddressStep();
      case 2:
        return renderConfirmationStep();
      case 3:
        return renderInvoiceStep();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'background.paper', 
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
            Carrinho
          </Typography>
          <Tooltip title="Sacola de Compras">
            <IconButton onClick={() => navigate('/menu')} sx={{ ml: 1 }}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Espaçamento para o AppBar fixo */}

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </Container>
    </Box>
  );
};

export default ShoppingCart; 