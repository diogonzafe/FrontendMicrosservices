import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Fade,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Fastfood as FastfoodIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const CodeVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyCode, sendVerificationCode } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Tenta obter o email dos parâmetros da URL ou do estado da navegação
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await verifyCode(email, code);
      setSuccess('Código verificado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/menu');
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError('Código inválido ou expirado. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      await sendVerificationCode(email);
      setSuccess('Novo código enviado para o seu email!');
    } catch (err) {
      setError('Erro ao reenviar código. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
        <CardContent sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <FastfoodIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              iFood Clone
            </Typography>
            <Typography component="h2" variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
              Verificação de Código
            </Typography>
          </Box>

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            </Fade>
          )}

          {success && (
            <Fade in={!!success}>
              <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
            </Fade>
          )}

          <form onSubmit={handleSubmit}>
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
              disabled={isLoading || isResending}
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
              label="Código de Verificação"
              name="code"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading || isResending}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || isResending || !email || !code}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Verificar Código'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="text"
                size="small"
                onClick={handleBackToLogin}
                disabled={isLoading || isResending}
              >
                Voltar ao Login
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={handleResendCode}
                disabled={isLoading || isResending || !email}
              >
                {isResending ? <CircularProgress size={20} /> : 'Reenviar Código'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CodeVerification;
