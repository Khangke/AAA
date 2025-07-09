import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Initial state
const initialState = {
  items: [],
  totalAmount: 0,
  itemCount: 0,
  shippingFee: 30000, // 30k VND shipping fee
  loading: false,
  error: null,
  isGuest: true // Default to guest mode
};

// Action types
const actionTypes = {
  LOAD_CART_START: 'LOAD_CART_START',
  LOAD_CART_SUCCESS: 'LOAD_CART_SUCCESS',
  LOAD_CART_FAILURE: 'LOAD_CART_FAILURE',
  ADD_TO_CART_START: 'ADD_TO_CART_START',
  ADD_TO_CART_SUCCESS: 'ADD_TO_CART_SUCCESS',
  ADD_TO_CART_FAILURE: 'ADD_TO_CART_FAILURE',
  UPDATE_CART_ITEM_SUCCESS: 'UPDATE_CART_ITEM_SUCCESS',
  REMOVE_FROM_CART_SUCCESS: 'REMOVE_FROM_CART_SUCCESS',
  CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_GUEST_MODE: 'SET_GUEST_MODE'
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOAD_CART_START:
    case actionTypes.ADD_TO_CART_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case actionTypes.LOAD_CART_SUCCESS:
    case actionTypes.ADD_TO_CART_SUCCESS:
    case actionTypes.UPDATE_CART_ITEM_SUCCESS:
    case actionTypes.REMOVE_FROM_CART_SUCCESS:
      const items = action.payload.items || action.payload || [];
      const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const itemCount = items.reduce((total, item) => total + item.quantity, 0);
      
      return {
        ...state,
        loading: false,
        items,
        totalAmount,
        itemCount,
        error: null
      };
    
    case actionTypes.CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [],
        totalAmount: 0,
        itemCount: 0,
        error: null
      };
    
    case actionTypes.LOAD_CART_FAILURE:
    case actionTypes.ADD_TO_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case actionTypes.SET_GUEST_MODE:
      return {
        ...state,
        isGuest: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, token } = useAuth();
  const { showCartNotification, showError } = useNotification() || {
    showCartNotification: () => {},
    showError: () => {}
  };

  // Load cart based on authentication status
  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch({ type: actionTypes.SET_GUEST_MODE, payload: false });
      loadCart();
    } else {
      dispatch({ type: actionTypes.SET_GUEST_MODE, payload: true });
      loadGuestCart();
    }
  }, [isAuthenticated, token]);

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (state.isGuest && state.items.length >= 0) {
      localStorage.setItem('guestCart', JSON.stringify(state.items));
    }
  }, [state.items, state.isGuest]);

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        dispatch({
          type: actionTypes.LOAD_CART_SUCCESS,
          payload: items
        });
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
    }
  };

  // API calls for authenticated users
  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: actionTypes.LOAD_CART_START });
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cart`);
      dispatch({
        type: actionTypes.LOAD_CART_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: actionTypes.LOAD_CART_FAILURE,
        payload: 'Không thể tải giỏ hàng'
      });
    }
  };

  // Add to cart - works for both guest and authenticated users
  const addToCart = async (product, quantity = 1) => {
    dispatch({ type: actionTypes.ADD_TO_CART_START });
    
    try {
      if (state.isGuest) {
        // Guest mode - use localStorage
        const currentItems = [...state.items];
        const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          currentItems[existingItemIndex].quantity += quantity;
        } else {
          currentItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
          });
        }
        
        dispatch({
          type: actionTypes.ADD_TO_CART_SUCCESS,
          payload: currentItems
        });
        
        // Show notification
        showCartNotification('add', product.name, quantity);
        
        return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng' };
      } else {
        // Authenticated mode - use API
        const response = await axios.post(`${BACKEND_URL}/api/cart/add`, {
          product_id: product.id,
          quantity
        });
        
        dispatch({
          type: actionTypes.ADD_TO_CART_SUCCESS,
          payload: response.data.cart
        });
        
        // Show notification
        showCartNotification('add', product.name, quantity);
        
        return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Không thể thêm sản phẩm vào giỏ hàng';
      dispatch({
        type: actionTypes.ADD_TO_CART_FAILURE,
        payload: errorMessage
      });
      
      // Show error notification
      showError(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      if (state.isGuest) {
        // Guest mode - use localStorage
        const currentItems = [...state.items];
        const updatedItems = currentItems.map(item => 
          item.id === productId 
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0);
        
        dispatch({
          type: actionTypes.UPDATE_CART_ITEM_SUCCESS,
          payload: updatedItems
        });
        
        const product = currentItems.find(item => item.id === productId);
        if (product) {
          showCartNotification('update', product.name, quantity);
        }
        
        return { success: true };
      } else {
        // Authenticated mode - use API
        const response = await axios.put(`${BACKEND_URL}/api/cart/item/${productId}`, {
          quantity
        });
        
        dispatch({
          type: actionTypes.UPDATE_CART_ITEM_SUCCESS,
          payload: response.data.cart
        });
        
        const product = state.items.find(item => item.id === productId);
        if (product) {
          showCartNotification('update', product.name, quantity);
        }
        
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Không thể cập nhật số lượng';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      let productName = '';
      const productToRemove = state.items.find(item => item.id === productId);
      if (productToRemove) {
        productName = productToRemove.name;
      }
      
      if (state.isGuest) {
        // Guest mode - use localStorage
        const updatedItems = state.items.filter(item => item.id !== productId);
        
        dispatch({
          type: actionTypes.REMOVE_FROM_CART_SUCCESS,
          payload: updatedItems
        });
        
        showCartNotification('remove', productName);
        
        return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng', productName };
      } else {
        // Authenticated mode - use API
        const response = await axios.delete(`${BACKEND_URL}/api/cart/item/${productId}`);
        
        dispatch({
          type: actionTypes.REMOVE_FROM_CART_SUCCESS,
          payload: response.data.cart
        });
        
        showCartNotification('remove', productName);
        
        return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng', productName };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Không thể xóa sản phẩm';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (state.isGuest) {
        // Guest mode - clear localStorage
        localStorage.removeItem('guestCart');
        dispatch({ type: actionTypes.CLEAR_CART_SUCCESS });
        return { success: true, message: 'Đã xóa tất cả sản phẩm trong giỏ hàng' };
      } else {
        // Authenticated mode - use API
        await axios.delete(`${BACKEND_URL}/api/cart`);
        dispatch({ type: actionTypes.CLEAR_CART_SUCCESS });
        return { success: true, message: 'Đã xóa tất cả sản phẩm trong giỏ hàng' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Không thể xóa giỏ hàng';
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Helper functions
  const getCartItemCount = () => {
    return state.itemCount;
  };

  const getCartTotal = () => {
    return state.totalAmount + state.shippingFee;
  };

  const getSubtotal = () => {
    return state.totalAmount;
  };

  const getShippingFee = () => {
    return state.shippingFee;
  };

  const isItemInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    clearError,
    getCartItemCount,
    getCartTotal,
    getSubtotal,
    getShippingFee,
    isItemInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;