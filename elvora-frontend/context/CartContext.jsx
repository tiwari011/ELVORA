import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  
  const fetchCart = async () => {
    try {
      const data = await api('/cart');
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setCart({ items: [], totalAmount: 0 });
        return;
      }
      try {
        const data = await api('/cart');
        setCart(data);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };

    loadCart();
  }, [isAuthenticated]);
  
  const addToCart = async (productId, quantity = 1) => {
    const data = await api('/cart', { method: 'POST', body: { productId, quantity } });
    setCart(data);
  };
  
  const updateCartItem = async (itemId, quantity) => {
    const data = await api(`/cart/${itemId}`, { method: 'PUT', body: { quantity } });
    setCart(data);
  };
  
  const removeFromCart = async (itemId) => {
    const data = await api(`/cart/${itemId}`, { method: 'DELETE' });
    setCart(data);
  };
  
  const clearCart = async () => {
    await api('/cart', { method: 'DELETE' });
    setCart({ items: [], totalAmount: 0 });
  };
  
  const cartCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const getCartTotal = () => cart.totalAmount || 0;
  
  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateCartItem, removeFromCart, clearCart, getCartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);