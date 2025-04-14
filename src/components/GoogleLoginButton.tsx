import React from 'react';
import { Button } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

interface GoogleLoginButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ disabled, onClick }) => {
  const handleClick = () => {
    // Redireciona para a URL de autenticação do Google
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={onClick || handleClick}
      disabled={disabled}
      sx={{
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      Login with Google
    </Button>
  );
};

export default GoogleLoginButton; 