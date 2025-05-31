import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Rating,
  Divider,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Badge,
  Tooltip
} from '@mui/material';
import { AddShoppingCart, Favorite, FavoriteBorder, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isFavorite: boolean;
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  cuisineType: string;
  deliveryTime: string;
  deliveryFee: number;
  isFavorite: boolean;
  distance: number;
}

const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Buscar dados do restaurante
        const restaurantResponse = await axios.get(`/api/restaurants/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setRestaurant(restaurantResponse.data);

        // Buscar itens do menu
        const menuResponse = await axios.get(`/api/restaurants/${id}/menu-items`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setMenuItems(menuResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Não foi possível carregar os dados do restaurante. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [id, navigate]);

  const handleAddToCart = (item: MenuItem) => {
    if (restaurant) {
      addToCart({
        name: item.name,
        price: item.price,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name
      });
    }
  };

  const toggleFavorite = async (itemId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/menu-items/${itemId}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMenuItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const handleShoppingCart = () => {
    navigate('/shopping-cart');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/menu')} sx={{ mt: 2 }}>
          Voltar ao Menu
        </Button>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>Restaurante não encontrado</Alert>
        <Button variant="contained" onClick={() => navigate('/menu')} sx={{ mt: 2 }}>
          Voltar ao Menu
        </Button>
      </Container>
    );
  }

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
            {restaurant.name}
          </Typography>
          <Tooltip title="Sacola de Compras">
            <IconButton onClick={handleShoppingCart} sx={{ ml: 1 }}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Espaçamento para o AppBar fixo */}

      <Container sx={{ py: 4 }}>
        {/* Cabeçalho do Restaurante */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {restaurant.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={restaurant.rating || 0} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({restaurant.rating || 0})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {restaurant.cuisineType} • {restaurant.deliveryTime} • R$ {(restaurant.deliveryFee || 0).toFixed(2)} de taxa
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(restaurant.distance || 0).toFixed(1)}km de distância
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Lista de Itens do Menu */}
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <IconButton onClick={() => toggleFavorite(item.id)}>
                      {item.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    R$ {(item.price || 0).toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddShoppingCart />}
                    onClick={() => handleAddToCart(item)}
                    sx={{ mt: 2 }}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Botão Voltar */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/menu')}>
            Voltar ao Menu
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RestaurantMenu; 