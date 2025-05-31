import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Menu from '../pages/Menu';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import GoogleCallback from '../pages/GoogleCallback';
import PrivateRoute from '../components/PrivateRoute';
import Restaurants from '../pages/Restaurants';
import RestaurantCreate from '../pages/RestaurantCreate';
import MenuItemCreate from '../pages/MenuItemCreate';
import MenuItemList from '../pages/MenuItemList';
import RestaurantEdit from '../pages/RestaurantEdit';
import MenuItemEdit from '../pages/MenuItemEdit';
import ShoppingCart from '../pages/ShoppingCart';
import Order from '../pages/Order';
import Invoice from '../pages/Invoice';

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
      <Route path="/restaurants" element={
        <PrivateRoute>
          <Restaurants />
        </PrivateRoute>
      } />
      <Route path="/restaurant/create" element={
        <PrivateRoute>
          <RestaurantCreate />
        </PrivateRoute>
      } />
      <Route path="/restaurants/:restaurantId/menu-items/create" element={
        <PrivateRoute>
          <MenuItemCreate />
        </PrivateRoute>
      } />
      <Route path="/restaurants/:restaurantId/menu-items" element={
        <PrivateRoute>
          <MenuItemList />
        </PrivateRoute>
      } />
      <Route path="/restaurants/edit/:id" element={
        <PrivateRoute>
          <RestaurantEdit />
        </PrivateRoute>
      } />
      <Route path="/restaurants/:restaurantId/menu-items/edit/:id" element={
        <PrivateRoute>
          <MenuItemEdit />
        </PrivateRoute>
      } />
      <Route path="/shopping-cart" element={
        <PrivateRoute>
          <ShoppingCart />
        </PrivateRoute>
      } />
      <Route path="/order" element={
        <PrivateRoute>
          <Order />
        </PrivateRoute>
      } />
      <Route path="/invoice" element={
        <PrivateRoute>
          <Invoice />
        </PrivateRoute>
      } />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
