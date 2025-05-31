import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Divider, Grid } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Invoice: React.FC = () => {
  const { lastOrder } = useCart();
  const navigate = useNavigate();

  if (!lastOrder) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Fatura
        </Typography>
        <Typography>Nenhum pedido foi finalizado.</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/menu')} sx={{ mt: 2 }}>
          Voltar ao Menu
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fatura
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Pedido Confirmado!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Data: {lastOrder.date.toLocaleDateString('pt-BR')} às {lastOrder.date.toLocaleTimeString('pt-BR')}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Endereço de Entrega */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <LocationOnIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Endereço de Entrega
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {lastOrder.deliveryAddress}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Detalhes do Pedido
        </Typography>
        <List>
          {lastOrder.items.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText 
                  primary={item.name} 
                  secondary={`R$ ${item.price.toFixed(2)}`} 
                />
              </ListItem>
              {index < lastOrder.items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">Subtotal:</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body1">R$ {lastOrder.total.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Taxa de entrega:</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body1">R$ 5.00</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Total:</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="h6">R$ {(lastOrder.total + 5).toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" color="primary" onClick={() => navigate('/menu')}>
          Fazer Novo Pedido
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
          Voltar ao Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default Invoice; 