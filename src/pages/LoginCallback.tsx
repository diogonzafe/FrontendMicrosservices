import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoginCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    console.log('LoginCallback - Token:', token);
    console.log('LoginCallback - Name:', name);
    console.log('LoginCallback - Email:', email);

    if (!token || !name || !email) {
      console.log('LoginCallback - Missing parameters, redirecting to login');
      navigate('/login');
      return;
    }

    const handleCallback = async () => {
      try {
        console.log('LoginCallback - Attempting to login with token');
        await loginWithToken(token, { name, email });
        console.log('LoginCallback - Login successful, redirecting to menu');
        navigate('/menu', { replace: true });
      } catch (error) {
        console.error('LoginCallback - Login error:', error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, loginWithToken]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Processing login...
      </Typography>
    </Box>
  );
};

export default LoginCallback; 