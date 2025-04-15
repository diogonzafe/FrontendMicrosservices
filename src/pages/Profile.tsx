import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, CardContent, CardHeader, CardActions, 
  TextField, Button, Grid, Typography, Divider,
  IconButton, Chip, Dialog, DialogActions, 
  DialogContent, DialogTitle, Snackbar, Alert,
  CircularProgress, Box, Avatar, AppBar, Toolbar,
  List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  LocalPostOffice as LocalPostOfficeIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

// Definindo interface para o perfil do usuário
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

// Estilo para o modo escuro
const darkModeStyles = {
  backgroundColor: '#121212',
  color: '#f0f0f0',
  card: {
    backgroundColor: '#1e1e1e',
    color: '#f0f0f0'
  },
  button: {
    color: '#f0f0f0'
  },
  appBar: {
    backgroundColor: '#1a1a1a'
  },
  icon: {
    color: '#ff5a5f'
  },
  secondaryText: {
    color: '#b0b0b0'
  }
};

// Estilo para o modo claro
const lightModeStyles = {
  backgroundColor: '#f5f5f5',
  color: '#333',
  card: {
    backgroundColor: '#fff',
    color: '#333'
  },
  button: {
    color: '#333'
  },
  appBar: {
    backgroundColor: '#ea1d2c' // Cor vermelha do iFood
  },
  icon: {
    color: '#ea1d2c'
  },
  secondaryText: {
    color: '#666'
  }
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAddressDialogOpen, setDeleteAddressDialogOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const currentStyle = theme === 'dark' ? darkModeStyles : lightModeStyles;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/me');
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    try {
      setLoading(true);
      await api.put(`/users/${profile?.id}`, editedProfile);
      setProfile(editedProfile);
      setEditMode(false);
      setSuccessMessage('Perfil atualizado com sucesso!');
    } catch (err) {
      setError('Falha ao atualizar perfil. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await api.delete(`/users/${profile?.id}`);
      setSuccessMessage('Conta deletada com sucesso. Redirecionando...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Falha ao deletar conta. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      setLoading(true);
      await api.delete(`/users/${profile?.id}/address`);
      const updatedProfile = { ...profile, address: undefined };
      setProfile(updatedProfile as UserProfile);
      setEditedProfile(updatedProfile as UserProfile);
      setSuccessMessage('Endereço deletado com sucesso!');
      setDeleteAddressDialogOpen(false);
    } catch (err) {
      setError('Falha ao deletar endereço. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => {
      if (!prev) return null;
      if (name.includes('address.')) {
        const addressField = name.split('.')[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value
          }
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const cardVariants = {
    hover: { 
      scale: 1.02, 
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (loading && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={currentStyle.backgroundColor}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={currentStyle.backgroundColor}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={currentStyle.backgroundColor}>
        <Alert severity="error">Dados do perfil não disponíveis.</Alert>
      </Box>
    );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={fadeIn}
      style={{ minHeight: '100vh', background: currentStyle.backgroundColor, color: currentStyle.color, padding: '0px 0px 20px 0px' }}
    >
      <AppBar position="static" style={currentStyle.appBar} elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="voltar">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
            Meu Perfil
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Grid container spacing={3} justifyContent="center" sx={{ padding: '16px' }}>
        <Grid item xs={12} sm={10} md={8}>
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Card style={currentStyle.card} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: '#ea1d2c', width: 80, height: 80, fontSize: 32 }}>{profile.name.charAt(0)}</Avatar>
                }
                title={<Typography variant="h4" sx={{ fontWeight: 'bold' }}>{profile.name}</Typography>}
                subheader={<Typography variant="body1" color={theme === 'dark' ? currentStyle.secondaryText.color : 'text.secondary'}>{profile.email}</Typography>}
              />
              <Divider />
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ea1d2c', marginBottom: '16px' }}>Informações Pessoais</Typography>
                    {editMode ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Nome"
                          name="name"
                          value={editedProfile?.name || ''}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ style: { color: currentStyle.color } }}
                          InputProps={{ style: { color: currentStyle.color, backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' } }}
                          sx={{ marginBottom: '16px' }}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Email"
                          name="email"
                          value={editedProfile?.email || ''}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ style: { color: currentStyle.color } }}
                          InputProps={{ style: { color: currentStyle.color, backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' } }}
                          sx={{ marginBottom: '16px' }}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Telefone"
                          name="phone"
                          value={editedProfile?.phone || ''}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ style: { color: currentStyle.color } }}
                          InputProps={{ style: { color: currentStyle.color, backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' } }}
                          sx={{ marginBottom: '16px' }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <List>
                          <ListItem disablePadding sx={{ paddingBottom: '16px' }}>
                            <ListItemIcon>
                              <PersonIcon style={currentStyle.icon} fontSize="large" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Nome</Typography>} secondary={<Typography variant="body1" color={theme === 'dark' ? currentStyle.secondaryText.color : 'text.secondary'}>{profile.name}</Typography>} />
                          </ListItem>
                          <ListItem disablePadding sx={{ paddingBottom: '16px' }}>
                            <ListItemIcon>
                              <EmailIcon style={currentStyle.icon} fontSize="large" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Email</Typography>} secondary={<Typography variant="body1" color={theme === 'dark' ? currentStyle.secondaryText.color : 'text.secondary'}>{profile.email}</Typography>} />
                          </ListItem>
                          <ListItem disablePadding sx={{ paddingBottom: '16px' }}>
                            <ListItemIcon>
                              <PhoneIcon style={currentStyle.icon} fontSize="large" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Telefone</Typography>} secondary={<Typography variant="body1" color={theme === 'dark' ? currentStyle.secondaryText.color : 'text.secondary'}>{profile.phone || 'Não informado'}</Typography>} />
                          </ListItem>
                        </List>
                      </motion.div>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ea1d2c', marginBottom: '16px' }}>Endereço</Typography>
                    {editMode ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Rua"
                          name="address.street"
                          value={editedProfile?.address?.street || ''}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ style: { color: currentStyle.color } }}
                          InputProps={{ style: { color: currentStyle.color, backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' } }}
                          sx={{ marginBottom: '16px' }}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Cidade"
                          name="address.city"
                          value={editedProfile?.address?.city || ''}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ style: { color: currentStyle.color } }}
                          InputProps={{ style: { color: currentStyle.color, backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' } }}
                          sx={{ marginBottom: '16px' }}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Estado"
                          name="address.state"
                          value={editedProfile?.address?.state || ''}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ style: { color: currentStyle.color } }}
                          InputProps={{ style: { color: currentStyle.color, backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' } }}
                          sx={{ marginBottom: '16px' }}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="CEP"
                          name="address.zipCode"
                          value={editedProfile?.address?.zipCode || ''}
                          onChange={handleInputChange}
                          variant="outlined"
                          InputLabelProps={{ style: { color: currentStyle.color } }}
                          InputProps={{ style: { color: currentStyle.color, backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' } }}
                          sx={{ marginBottom: '16px' }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        {profile.address ? (
                          <List>
                            <ListItem disablePadding sx={{ paddingBottom: '16px' }}>
                              <ListItemIcon>
                                <HomeIcon style={currentStyle.icon} fontSize="large" />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Rua</Typography>} secondary={<Typography variant="body1" color={theme === 'dark' ? currentStyle.secondaryText.color : 'text.secondary'}>{profile.address.street || 'Não informado'}</Typography>} />
                            </ListItem>
                            <ListItem disablePadding sx={{ paddingBottom: '16px' }}>
                              <ListItemIcon>
                                <LocationCityIcon style={currentStyle.icon} fontSize="large" />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Cidade</Typography>} secondary={<Typography variant="body1" color={theme === 'dark' ? currentStyle.secondaryText.color : 'text.secondary'}>{profile.address.city || 'Não informado'}</Typography>} />
                            </ListItem>
                            <ListItem disablePadding sx={{ paddingBottom: '16px' }}>
                              <ListItemIcon>
                                <PublicIcon style={currentStyle.icon} fontSize="large" />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Estado</Typography>} secondary={<Typography variant="body1" color={theme === 'dark' ? currentStyle.secondaryText.color : 'text.secondary'}>{profile.address.state || 'Não informado'}</Typography>} />
                            </ListItem>
                            <ListItem disablePadding sx={{ paddingBottom: '16px' }}>
                              <ListItemIcon>
                                <LocalPostOfficeIcon style={currentStyle.icon} fontSize="large" />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>CEP</Typography>} secondary={<Typography variant="body1" color={theme === 'dark' ? currentStyle.secondaryText.color : 'text.secondary'}>{profile.address.zipCode || 'Não informado'}</Typography>} />
                            </ListItem>
                          </List>
                        ) : (
                          <Typography variant="body1">Nenhum endereço cadastrado.</Typography>
                        )}
                      </motion.div>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ px: 4, py: 2, justifyContent: 'space-between' }}>
                <Box>
                  {editMode ? (
                    <AnimatePresence>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button 
                          startIcon={<SaveIcon />} 
                          onClick={handleSave} 
                          disabled={loading}
                          sx={{ mr: 1, borderRadius: 2, textTransform: 'none', backgroundColor: '#ea1d2c', color: '#fff', '&:hover': { backgroundColor: '#c4121f' }, padding: '10px 20px', fontSize: '16px' }}
                        >
                          Salvar
                        </Button>
                        <Button 
                          startIcon={<CancelIcon />} 
                          onClick={handleCancel}
                          sx={{ borderRadius: 2, textTransform: 'none', color: theme === 'dark' ? '#f0f0f0' : '#333', padding: '10px 20px', fontSize: '16px' }}
                        >
                          Cancelar
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button 
                          startIcon={<EditIcon />} 
                          onClick={handleEdit}
                          sx={{ mr: 1, borderRadius: 2, textTransform: 'none', backgroundColor: '#ea1d2c', color: '#fff', '&:hover': { backgroundColor: '#c4121f' }, padding: '10px 20px', fontSize: '16px' }}
                        >
                          Editar Perfil
                        </Button>
                        {profile.address && (
                          <Button 
                            startIcon={<DeleteIcon />} 
                            onClick={() => setDeleteAddressDialogOpen(true)}
                            color="warning"
                            sx={{ mr: 1, borderRadius: 2, textTransform: 'none', padding: '10px 20px', fontSize: '16px' }}
                            style={currentStyle.button}
                          >
                            Deletar Endereço
                          </Button>
                        )}
                        <Button 
                          startIcon={<DeleteIcon />} 
                          onClick={() => setDeleteDialogOpen(true)}
                          color="error"
                          sx={{ borderRadius: 2, textTransform: 'none', padding: '10px 20px', fontSize: '16px' }}
                          style={currentStyle.button}
                        >
                          Deletar Conta
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </Box>
                <Chip label={editMode ? 'Editando' : 'Visualizando'} color={editMode ? 'primary' : 'default'} size="medium" />
              </CardActions>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Deletar Conta</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteAccount} color="error" disabled={loading}>Deletar</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Address Dialog */}
      <Dialog open={deleteAddressDialogOpen} onClose={() => setDeleteAddressDialogOpen(false)}>
        <DialogTitle>Deletar Endereço</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja deletar seu endereço?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAddressDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteAddress} color="warning" disabled={loading}>Deletar</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default Profile;