import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userDataStr = params.get('userData');

        if (token && userDataStr) {
          const userData = JSON.parse(decodeURIComponent(userDataStr));
          
          // Salvar token e dados do usuário
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Atualizar estado de autenticação
          await login(userData);
          
          // Redirecionar para o menu
          navigate('/menu');
        } else {
          console.error('Token ou dados do usuário não encontrados');
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro ao processar callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

export default OAuthCallback; 