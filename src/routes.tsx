import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import RestaurantMenu from './pages/RestaurantMenu';
import Profile from './pages/Profile';
import ShoppingCart from './pages/ShoppingCart';
import Restaurants from './pages/Restaurants';
import OAuthCallback from './pages/OAuthCallback';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
      <Route path="/restaurants/:id/menu" element={<RestaurantMenu />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/shopping-cart" element={<PrivateRoute><ShoppingCart /></PrivateRoute>} />
      <Route path="/restaurants" element={<PrivateRoute><Restaurants /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/menu" />} />
    </Routes>
  );
};

export default AppRoutes; 