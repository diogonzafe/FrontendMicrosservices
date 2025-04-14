import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import AppRoutes from './routes';
import './styles/animations.css';
import './styles/global.css';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
