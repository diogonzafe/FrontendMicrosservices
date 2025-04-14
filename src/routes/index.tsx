import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Menu from '../pages/Menu';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Menu />} />
      <Route path="/register" element={!user ? <Register /> : <Menu />} />
      <Route path="/menu" element={user ? <Menu /> : <Login />} />
      <Route path="/profile" element={user ? <Profile /> : <Login />} />
      <Route path="/" element={user ? <Menu /> : <Login />} />
    </Routes>
  );
};

export default AppRoutes;
