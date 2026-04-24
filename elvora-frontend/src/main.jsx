import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { AuthProvider } from '../context/AuthContext';
import { AdminProvider } from '../context/AdminContext';
import { CartProvider } from '../context/CartContext';
import { LanguageProvider } from '../context/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <Toaster position="top-right" />
            <App />
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
);