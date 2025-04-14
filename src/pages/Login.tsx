import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Fade,
  Card,
  CardContent
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Fastfood as FastfoodIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import * as jwt from 'jwt-decode';

interface GoogleUser {
  email: string;
  name: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/menu');
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: GoogleUser = jwt.jwtDecode(credentialResponse.credential);
      await loginWithGoogle(decoded.email, decoded.name);
      navigate('/menu');
    } catch (err) {
      setError('Erro ao fazer login com Google');
    }
  };

  return (
    <Fade in timeout={300}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Card className="card-hover scale-transition" sx={{ width: '100%', overflow: 'visible' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <FastfoodIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
                  Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Faça login para continuar
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} className="error-shake">
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} className="form-field">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          className="hover-scale"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                  className="button-ripple"
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>

                <Divider sx={{ my: 2 }}>ou</Divider>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Erro ao fazer login com Google')}
                  />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                    className="nav-link"
                    sx={{ textDecoration: 'none' }}
                  >
                    Não tem uma conta? Cadastre-se
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Fade>
  );
};

export default Login;