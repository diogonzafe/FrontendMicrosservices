import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      navigate('/login');
      return;
    }

    const handleGoogleCallback = async () => {
      try {
        await loginWithGoogle(code);
        navigate('/menu');
      } catch (error) {
        console.error('Google login error:', error);
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, loginWithGoogle]);

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
        Processing Google login...
      </Typography>
    </Box>
  );
};

export default GoogleCallback; 