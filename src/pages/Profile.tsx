import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userService, { Address, UserProfileData } from '../services/userService';
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Fade,
  useTheme,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfileData>>({});
  const [newAddress, setNewAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipcode: ''
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    loadUserProfile();
  }, [user, navigate, authLoading]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUserProfile(user!.id);
      setProfileData(data);
      setEditData(data);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError('Erro ao carregar perfil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    if (isAddingAddress) {
      setNewAddress(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        address: {
          ...((prev.address || {}) as Address),
          [field]: value
        }
      }));
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      await userService.updateProfile(user.id, editData);
      setSuccessMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      loadUserProfile();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError(err.response?.data?.message || 'Erro ao atualizar perfil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      await userService.updateAddress(user.id, newAddress);
      setSuccessMessage('Endereço adicionado com sucesso!');
      setIsAddingAddress(false);
      loadUserProfile();
    } catch (err: any) {
      console.error('Error adding address:', err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError(err.response?.data?.message || 'Erro ao adicionar endereço');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!user || !editData.address) return;

    try {
      setIsLoading(true);
      await userService.updateAddress(user.id, editData.address);
      setSuccessMessage('Endereço atualizado com sucesso!');
      setIsEditing(false);
      loadUserProfile();
    } catch (err: any) {
      console.error('Error updating address:', err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError(err.response?.data?.message || 'Erro ao atualizar endereço');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      await userService.deleteAddress(user.id);
      setSuccessMessage('Endereço excluído com sucesso!');
      loadUserProfile();
    } catch (err: any) {
      console.error('Error deleting address:', err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError(err.response?.data?.message || 'Erro ao excluir endereço');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      await userService.deleteAccount(user.id);
      setSuccessMessage('Conta excluída com sucesso!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      logout();
    } catch (err: any) {
      console.error('Error deleting account:', err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError(err.response?.data?.message || 'Erro ao excluir conta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderAddressFields = (address: Address | null | undefined, disabled: boolean = false) => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Rua"
          value={address?.street || ''}
          onChange={(e) => handleAddressChange('street', e.target.value)}
          disabled={disabled || isLoading}
          required
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Número"
          value={address?.number || ''}
          onChange={(e) => handleAddressChange('number', e.target.value)}
          disabled={disabled || isLoading}
          required
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Complemento"
          value={address?.complement || ''}
          onChange={(e) => handleAddressChange('complement', e.target.value)}
          disabled={disabled || isLoading}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Bairro"
          value={address?.neighborhood || ''}
          onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
          disabled={disabled || isLoading}
          required
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Cidade"
          value={address?.city || ''}
          onChange={(e) => handleAddressChange('city', e.target.value)}
          disabled={disabled || isLoading}
          required
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Estado"
          value={address?.state || ''}
          onChange={(e) => handleAddressChange('state', e.target.value)}
          disabled={disabled || isLoading}
          required
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="CEP"
          value={address?.zipcode || ''}
          onChange={(e) => handleAddressChange('zipcode', e.target.value)}
          disabled={disabled || isLoading}
          required
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Grid>
    </Grid>
  );

  if (authLoading || (isLoading && !profileData)) {
    return (
      <Container maxWidth="md">
        <Box my={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: '#fff'
            }}
          >
            <Box mb={4}>
              <Skeleton variant="text" width="200px" height={40} />
            </Box>
            <Grid container spacing={3}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
              ))}
            </Grid>
            <Box mt={4} mb={2}>
              <Skeleton variant="text" width="150px" height={32} />
            </Box>
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
              ))}
            </Grid>
            <Box mt={4} display="flex" gap={2}>
              <Skeleton variant="rectangular" width={150} height={40} />
              <Skeleton variant="rectangular" width={150} height={40} />
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Fade in timeout={500}>
        <Box my={4}>
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(234, 29, 44, 0.04)'
              }
            }}
          >
            Voltar ao Menu
          </Button>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: '#fff',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <Box display="flex" alignItems="center" mb={4}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                Perfil
              </Typography>
              {!isEditing && (
                <IconButton 
                  color="primary" 
                  onClick={() => setIsEditing(true)}
                  sx={{ ml: 2 }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>

            {error && (
              <Alert 
                severity="error" 
                onClose={() => setError(null)} 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  animation: 'error-shake 0.5s'
                }}
              >
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert 
                severity="success" 
                onClose={() => setSuccessMessage(null)} 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  animation: 'success-bounce 0.5s'
                }}
              >
                {successMessage}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={isEditing ? editData.name : profileData?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing || isLoading}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={isEditing ? editData.email : profileData?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing || isLoading}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={isEditing ? editData.phone : profileData?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing || isLoading}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box mt={4} mb={2} display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" color="primary" fontWeight="bold">
                  Endereço
                </Typography>
              </Box>
              {!profileData?.address && !isAddingAddress && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsAddingAddress(true)}
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Adicionar Endereço
                </Button>
              )}
            </Box>

            {profileData?.address ? (
              <>
                {renderAddressFields(isEditing ? editData.address : profileData.address, !isEditing)}
                {isEditing && (
                  <Box mt={2} display="flex" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateAddress}
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Salvar Endereço
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteAddress}
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Excluir Endereço
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Dialog 
                open={isAddingAddress} 
                onClose={() => setIsAddingAddress(false)}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Adicionar Endereço
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Box mt={2}>
                    {renderAddressFields(newAddress)}
                  </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsAddingAddress(false)}
                    disabled={isLoading}
                    startIcon={<CancelIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddAddress}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Adicionar
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            <Box mt={4} display="flex" gap={2} flexWrap="wrap">
              {!isEditing ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
                  className="error-shake"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    minWidth: 150,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(234, 29, 44, 0.2)'
                    }
                  }}
                >
                  Excluir Conta
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      minWidth: 150,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(234, 29, 44, 0.2)'
                      }
                    }}
                  >
                    Salvar
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(profileData || {});
                    }}
                    disabled={isLoading}
                    startIcon={<CancelIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      minWidth: 150,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Profile;
