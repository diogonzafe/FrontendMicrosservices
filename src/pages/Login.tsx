import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Fade,
  Card,
  CardContent,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Fastfood as FastfoodIcon,
  Google as GoogleIcon,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useThemeContext } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { sendVerificationCode, verifyCode, loginWithGoogle } = useAuth();
  const themeContext = useThemeContext();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await sendVerificationCode(email);
      setIsCodeSent(true);
      setSuccessMessage(response || 'Código enviado com sucesso! Verifique seu e-mail.');
    } catch (err) {
      setError('Erro ao enviar código de verificação. Verifique o e-mail fornecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await verifyCode(email, code);
      navigate('/menu');
    } catch (err) {
      setError('Código inválido ou expirado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    try {
      loginWithGoogle();
    } catch (err) {
      setError('Erro ao iniciar login com Google.');
      setIsLoading(false);
    }
  };

  return (
    <Fade in timeout={300}>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: themeContext.theme === 'dark' ? '#181818' : 'background.default',
            background: themeContext.theme === 'dark' ? 'linear-gradient(to bottom right, #181818, #282828)' : 'none'
          }}
        >
          <Card className="card-hover scale-transition" sx={{ 
            width: '100%', 
            maxWidth: 500, 
            overflow: 'visible', 
            boxShadow: themeContext.theme === 'dark' ? '0 10px 30px rgba(255, 75, 90, 0.15)' : 3, 
            bgcolor: themeContext.theme === 'dark' ? '#222222' : 'background.paper', 
            color: themeContext.theme === 'dark' ? '#FFFFFF' : 'text.primary',
            borderRadius: 3,
            border: themeContext.theme === 'dark' ? '1px solid rgba(255, 75, 90, 0.2)' : 'none'
          }}>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <IconButton onClick={themeContext.toggleTheme} sx={{ ml: 1, color: themeContext.theme === 'dark' ? '#FF4B5A' : 'text.primary' }}>
                  {themeContext.theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <FastfoodIcon sx={{ fontSize: 60, color: themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main', mb: 1 }} />
                <Typography component="h1" variant="h3" fontWeight="bold" color={themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main'}>
                  Delivery App
                </Typography>
                <Typography variant="body1" color={themeContext.theme === 'dark' ? '#CCCCCC' : 'text.secondary'} sx={{ mt: 1, textAlign: 'center' }}>
                  {isCodeSent ? 'Digite o código enviado para seu e-mail' : 'Entre com seu e-mail para receber um código de acesso'}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: themeContext.theme === 'dark' ? 'rgba(211, 47, 47, 0.3)' : 'error.light', color: themeContext.theme === 'dark' ? '#FFFFFF' : 'error.main' }} className="error-shake">
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert severity="success" sx={{ mb: 3, bgcolor: themeContext.theme === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'success.light', color: themeContext.theme === 'dark' ? '#FFFFFF' : 'success.main' }}>
                  {successMessage}
                </Alert>
              )}

              <Box component="form" onSubmit={isCodeSent ? handleVerifyCode : handleSendCode} className="form-field">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isCodeSent || isLoading}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ color: themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main', fontSize: 24 }} />
                      </Box>
                    ),
                    sx: { borderRadius: 2, color: themeContext.theme === 'dark' ? '#FFFFFF' : 'text.primary', bgcolor: themeContext.theme === 'dark' ? '#3A3A3A' : 'background.default', borderColor: themeContext.theme === 'dark' ? '#4A4A4A' : 'divider' }
                  }}
                  InputLabelProps={{
                    sx: { color: themeContext.theme === 'dark' ? '#CCCCCC' : 'text.secondary' }
                  }}
                  variant="outlined"
                />

                {isCodeSent && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Código de Verificação"
                    name="code"
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isLoading}
                    InputProps={{
                      sx: { borderRadius: 2, color: themeContext.theme === 'dark' ? '#FFFFFF' : 'text.primary', bgcolor: themeContext.theme === 'dark' ? '#3A3A3A' : 'background.default', borderColor: themeContext.theme === 'dark' ? '#4A4A4A' : 'divider' }
                    }}
                    InputLabelProps={{
                      sx: { color: themeContext.theme === 'dark' ? '#CCCCCC' : 'text.secondary' }
                    }}
                    variant="outlined"
                  />
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, boxShadow: 2, bgcolor: themeContext.theme === 'dark' ? '#FF4B5A' : 'primary.main', color: '#FFFFFF', '&:hover': { bgcolor: themeContext.theme === 'dark' ? '#FF7582' : 'primary.dark' } }}
                >
                  {isLoading ? <CircularProgress size={24} /> : isCodeSent ? 'Verificar Código' : 'Enviar Código'}
                </Button>

                {isCodeSent && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="text"
                      onClick={() => {
                        setIsCodeSent(false);
                        setCode('');
                        setSuccessMessage('');
                      }}
                      disabled={isLoading}
                      sx={{ textDecoration: 'underline', textTransform: 'none', color: themeContext.theme === 'dark' ? '#FF7582' : 'primary.main' }}
                    >
                      Usar outro e-mail
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3, borderColor: themeContext.theme === 'dark' ? '#4A4A4A' : 'divider' }}>
                <Typography variant="body2" color={themeContext.theme === 'dark' ? '#CCCCCC' : 'text.secondary'}>
                  ou
                </Typography>
              </Divider>

              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: themeContext.theme === 'dark' ? '#3A3A3A' : 'background.paper',
                    color: themeContext.theme === 'dark' ? '#FFFFFF' : 'text.primary',
                    borderColor: themeContext.theme === 'dark' ? '#4A4A4A' : 'divider',
                    '&:hover': {
                      backgroundColor: themeContext.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'action.hover',
                      borderColor: themeContext.theme === 'dark' ? '#5A5A5A' : 'divider',
                    },
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: 1
                  }}
                >
                  Entrar com Google
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Fade>
  );
};

export default Login;