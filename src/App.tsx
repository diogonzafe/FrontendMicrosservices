import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import theme from './theme';
import AppRoutes from './routes';
import './styles/animations.css';
import './styles/global.css';

const App = () => {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </BrowserRouter>
  );
};

export default App;
