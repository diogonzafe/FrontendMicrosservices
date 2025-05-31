import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  useTheme,
  Badge,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Fade,
  Paper,
  InputBase,
  Container,
  Button,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Rating,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Restaurant, 
  LocalOffer, 
  Favorite, 
  History,
  Search as SearchIcon,
  TrendingUp,
  LocalPizza,
  LocalDining,
  Fastfood,
  ShoppingCart as ShoppingCartIcon,
  AddShoppingCart
} from '@mui/icons-material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

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

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: number;
  restaurantName: string;
  isFavorite: boolean;
  cuisineType: string;
}

const Menu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const themeContext = useThemeContext();
  const { cart, addToCart } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [filters, setFilters] = useState({
    favorites: false,
    nearby: false,
    cuisineType: '',
    sortBy: 'rating'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando para login');
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token não encontrado, redirecionando para login');
      navigate('/login');
      return;
    }

    fetchRestaurants();
    fetchProducts();
  }, [filters, isAuthenticated, navigate]);

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token não encontrado em fetchRestaurants');
        navigate('/login');
        return;
      }

      console.log('Buscando restaurantes com filtros:', filters);
      const response = await axios.get('/api/restaurants', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          favorites: filters.favorites,
          nearby: filters.nearby,
          cuisineType: filters.cuisineType || undefined,
          sortBy: filters.sortBy
        }
      });
      console.log('Restaurantes encontrados:', response.data);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('Token inválido ou expirado, redirecionando para login');
        navigate('/login');
        return;
      }
      setError('Não foi possível carregar os restaurantes. Por favor, tente novamente.');
      setRestaurants([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token não encontrado em fetchProducts');
        navigate('/login');
        return;
      }

      console.log('Buscando restaurantes...');
      // Primeiro, buscar todos os restaurantes
      const restaurantsResponse = await axios.get('/api/restaurants', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Restaurantes encontrados:', restaurantsResponse.data);

      // Depois, buscar os itens do menu de cada restaurante
      const allProducts = [];
      for (const restaurant of restaurantsResponse.data) {
        try {
          console.log(`Buscando menu do restaurante ${restaurant.id}...`);
          const menuResponse = await axios.get(`/api/restaurants/${restaurant.id}/menu-items`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log(`Menu do restaurante ${restaurant.id}:`, menuResponse.data);
          
          // Adicionar informações do restaurante aos produtos
          const productsWithRestaurant = menuResponse.data.map(item => ({
            ...item,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            cuisineType: restaurant.category,
            price: Number(item.price) || 0,
            rating: Number(item.rating) || 0,
            isFavorite: Boolean(item.isFavorite)
          }));
          
          allProducts.push(...productsWithRestaurant);
        } catch (error) {
          console.error(`Erro ao buscar menu do restaurante ${restaurant.id}:`, error);
        }
      }
      
      // Aplicar filtros
      const filteredProducts = allProducts.filter(product => {
        if (filters.favorites && !product.isFavorite) return false;
        if (filters.cuisineType && product.cuisineType !== filters.cuisineType) return false;
        return true;
      });

      // Ordenar produtos
      const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'price':
            return (a.price || 0) - (b.price || 0);
          default:
            return 0;
        }
      });
      
      console.log('Produtos filtrados e ordenados:', sortedProducts);
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('Token inválido ou expirado, redirecionando para login');
        navigate('/login');
        return;
      }
      setError('Não foi possível carregar os produtos. Por favor, tente novamente.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleAddRestaurant = () => {
    handleClose();
    navigate('/restaurants');
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleShoppingCart = () => {
    navigate('/shopping-cart');
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      name: product.name,
      price: product.price,
      restaurantId: product.restaurantId,
      restaurantName: product.restaurantName
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleFilterChange = (filter: string, value: any) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const toggleFavorite = async (type: 'restaurant' | 'product', id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/${type}s/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (type === 'restaurant') {
        setRestaurants(prev => prev.map(r => 
          r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
        ));
      } else {
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        ));
      }
    } catch (error) {
      console.error(`Erro ao atualizar favorito do ${type}:`, error);
    }
  };

  const handleViewRestaurantMenu = (restaurantId: number) => {
    console.log('Navegando para o menu do restaurante:', restaurantId);
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: themeContext.theme === 'dark' ? '#1A1A1A' : 'background.default', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: themeContext.theme === 'dark' ? '#2D2D2D' : 'background.paper', 
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: themeContext.theme === 'dark' ? '#3A3A3A' : 'divider'
        }}
      >
        <Toolbar>
          <FastfoodIcon sx={{ mr: 2, color: themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main' }}>
            Delivery
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={themeContext.toggleTheme} sx={{ ml: 1 }}>
              {themeContext.theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Tooltip title="Sacola de Compras">
              <IconButton onClick={handleShoppingCart} sx={{ ml: 1 }}>
                <Badge badgeContent={cart.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Opções da conta">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{
                  ml: 2,
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color="secondary"
                >
                  <Avatar sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: themeContext.theme === 'dark' ? '#FF4B5A' : 'secondary.main',
                    color: themeContext.theme === 'dark' ? '#FFFFFF' : 'secondary.contrastText',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: themeContext.theme === 'dark' ? '#FF7582' : 'secondary.dark',
                      transform: 'rotate(5deg)'
                    }
                  }}>
                    {user?.name?.charAt(0).toUpperCase() || <PersonIcon />}
                  </Avatar>
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>

          <MuiMenu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            TransitionComponent={Fade}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                borderRadius: 2,
                minWidth: 200,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfile} sx={{
              py: 1.5,
              color: themeContext.theme === 'dark' ? '#FFFFFF' : 'text.primary',
              '&:hover': {
                bgcolor: themeContext.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                '& .MuiListItemIcon-root': {
                  color: themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main'
                }
              }
            }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Meu Perfil
            </MenuItem>

            <MenuItem onClick={handleAddRestaurant} sx={{
              py: 1.5,
              color: themeContext.theme === 'dark' ? '#FFFFFF' : 'text.primary',
              '&:hover': {
                bgcolor: themeContext.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                '& .MuiListItemIcon-root': {
                  color: themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main'
                }
              }
            }}>
              <ListItemIcon>
                <AddBusinessIcon fontSize="small" />
              </ListItemIcon>
              Restaurantes
            </MenuItem>

            <MenuItem onClick={handleLogout} sx={{
              py: 1.5,
              color: themeContext.theme === 'dark' ? '#FFFFFF' : 'text.primary',
              '&:hover': {
                bgcolor: themeContext.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                '& .MuiListItemIcon-root': {
                  color: themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main'
                }
              }
            }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </MuiMenu>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Espaçamento para o AppBar fixo */}

      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          Restaurantes
        </Typography>

        {/* Barra de Pesquisa */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar restaurantes ou produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Filtros */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Cozinha</InputLabel>
                <Select
                  value={filters.cuisineType}
                  onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
                  label="Tipo de Cozinha"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="italian">Italiana</MenuItem>
                  <MenuItem value="japanese">Japonesa</MenuItem>
                  <MenuItem value="brazilian">Brasileira</MenuItem>
                  <MenuItem value="fast-food">Fast Food</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  label="Ordenar por"
                >
                  <MenuItem value="rating">Avaliação</MenuItem>
                  <MenuItem value="distance">Distância</MenuItem>
                  <MenuItem value="deliveryTime">Tempo de Entrega</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Chip
                label="Favoritos"
                onClick={() => handleFilterChange('favorites', !filters.favorites)}
                color={filters.favorites ? 'primary' : 'default'}
                icon={filters.favorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Chip
                label="Próximos a mim"
                onClick={() => handleFilterChange('nearby', !filters.nearby)}
                color={filters.nearby ? 'primary' : 'default'}
                icon={<LocationOnIcon />}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs para alternar entre Restaurantes e Produtos */}
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Restaurantes" />
          <Tab label="Produtos" />
        </Tabs>

        {/* Lista de Restaurantes */}
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {filteredRestaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{restaurant.name}</Typography>
                      <IconButton onClick={() => toggleFavorite('restaurant', restaurant.id)}>
                        {restaurant.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Box>
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
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleViewRestaurantMenu(restaurant.id)}
                    >
                      Ver Menu
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Lista de Produtos */}
        {selectedTab === 1 && (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{product.name}</Typography>
                      <IconButton onClick={() => toggleFavorite('product', product.id)}>
                        {product.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.cuisineType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      R$ {(product.price || 0).toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Menu;