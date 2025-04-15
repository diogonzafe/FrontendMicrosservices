import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for token in URL parameters or local storage
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userDataStr = params.get('userData');

        if (token && userDataStr) {
          // Parse user data
          const userData = JSON.parse(decodeURIComponent(userDataStr));
          // Use login method from AuthContext
          login(userData, token);
        } else {
          setError('Token não encontrado na resposta do Google OAuth');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Erro ao processar callback do Google:', err);
        setError('Erro ao processar autenticação com Google. Redirecionando para login...');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <CircularProgress />
            <Typography variant="h6">Processando autenticação com Google...</Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default GoogleCallback;