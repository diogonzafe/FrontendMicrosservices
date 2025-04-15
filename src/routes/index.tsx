import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Menu from '../pages/Menu';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import GoogleCallback from '../pages/GoogleCallback';
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-callback" element={<GoogleCallback />} />
      <Route path="/menu" element={
        <PrivateRoute>
          <Menu />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
