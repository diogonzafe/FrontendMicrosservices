import React, { useState } from 'react';
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
  Container
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
  Fastfood
} from '@mui/icons-material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useAuth } from '../contexts/AuthContext';

const Menu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
    navigate('/add-restaurant');
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const categories = [
    { icon: <LocalPizza />, label: 'Pizza' },
    { icon: <LocalDining />, label: 'Brasileira' },
    { icon: <Fastfood />, label: 'Lanches' },
    { icon: <Restaurant />, label: 'Japonesa' },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'white', 
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <FastfoodIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
            Delivery
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    bgcolor: theme.palette.secondary.main,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.dark,
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
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main
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
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main
                }
              }
            }}>
              <ListItemIcon>
                <AddBusinessIcon fontSize="small" />
              </ListItemIcon>
              Adicionar Restaurante
            </MenuItem>

            <MenuItem onClick={handleLogout} sx={{
              py: 1.5,
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.04)',
                '& .MuiListItemIcon-root': {
                  color: theme.palette.error.main
                }
              }
            }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </MuiMenu>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Espaçamento para o AppBar fixo */}

      <Container maxWidth="lg">
        {/* Banner */}
        <Box
          sx={{
            mt: 4,
            mb: 6,
            p: 4,
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: '0 8px 32px rgba(234, 29, 44, 0.2)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, #EA1D2C 30%, #FF4B5A 90%)',
              opacity: 0.9,
              zIndex: 1,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Bem-vindo ao Delivery
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Os melhores restaurantes, direto na sua casa
            </Typography>

            {/* Barra de pesquisa */}
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', sm: '70%', md: '50%' },
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Buscar restaurantes ou pratos"
                inputProps={{ 'aria-label': 'buscar restaurantes ou pratos' }}
              />
            </Paper>
          </Box>
        </Box>

        {/* Categorias */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Categorias
        </Typography>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    '& .category-icon': {
                      color: 'primary.main',
                      transform: 'scale(1.1)',
                    }
                  }
                }}
              >
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Box
                    className="category-icon"
                    sx={{
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'grey.100',
                      mb: 2,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {React.cloneElement(category.icon, { sx: { fontSize: 32 } })}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {category.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Seções principais */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                '& .card-icon': {
                  color: 'primary.main',
                  transform: 'scale(1.1) rotate(10deg)',
                }
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box className="card-icon" sx={{ transition: 'all 0.3s ease' }}>
                    <Restaurant sx={{ mr: 1, fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6">Restaurantes</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Explore os melhores restaurantes da região
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                '& .card-icon': {
                  color: 'primary.main',
                  transform: 'scale(1.1) rotate(-10deg)',
                }
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box className="card-icon" sx={{ transition: 'all 0.3s ease' }}>
                    <LocalOffer sx={{ mr: 1, fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6">Ofertas</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Confira as melhores ofertas do dia
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                '& .card-icon': {
                  color: 'primary.main',
                  transform: 'scale(1.1) rotate(15deg)',
                }
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box className="card-icon" sx={{ transition: 'all 0.3s ease' }}>
                    <Favorite sx={{ mr: 1, fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6">Favoritos</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Seus restaurantes favoritos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                '& .card-icon': {
                  color: 'primary.main',
                  transform: 'scale(1.1) rotate(-15deg)',
                }
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box className="card-icon" sx={{ transition: 'all 0.3s ease' }}>
                    <History sx={{ mr: 1, fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6">Histórico</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Seus últimos pedidos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Trending */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            Em Alta
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    '& .restaurant-image': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}>
                  <Box
                    className="restaurant-image"
                    sx={{
                      height: 200,
                      bgcolor: 'grey.300',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Restaurante {item}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Descrição do restaurante {item}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Menu;