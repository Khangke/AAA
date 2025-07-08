import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Initial state
const initialState = {
  items: [],
  totalAmount: 0,
  itemCount: 0,
  loading: false,
  error: null
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
  CLEAR_ERROR: 'CLEAR_ERROR'
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
      return {
        ...state,
        loading: false,
        items: action.payload.items || [],
        totalAmount: action.payload.total_amount || 0,
        itemCount: (action.payload.items || []).reduce((total, item) => total + item.quantity, 0),
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

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      loadCart();
    } else {
      // Clear cart when user is not authenticated
      dispatch({ type: actionTypes.CLEAR_CART_SUCCESS });
    }
  }, [isAuthenticated, token]);

  // API calls
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

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' };
    }
    
    dispatch({ type: actionTypes.ADD_TO_CART_START });
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/cart/add`, {
        product_id: productId,
        quantity
      });
      
      dispatch({
        type: actionTypes.ADD_TO_CART_SUCCESS,
        payload: response.data.cart
      });
      
      return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng' };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Không thể thêm sản phẩm vào giỏ hàng';
      dispatch({
        type: actionTypes.ADD_TO_CART_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return { success: false, error: 'Vui lòng đăng nhập' };
    
    try {
      const response = await axios.put(`${BACKEND_URL}/api/cart/item/${productId}`, {
        quantity
      });
      
      dispatch({
        type: actionTypes.UPDATE_CART_ITEM_SUCCESS,
        payload: response.data.cart
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Không thể cập nhật số lượng';
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return { success: false, error: 'Vui lòng đăng nhập' };
    
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/cart/item/${productId}`);
      
      dispatch({
        type: actionTypes.REMOVE_FROM_CART_SUCCESS,
        payload: response.data.cart
      });
      
      return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Không thể xóa sản phẩm';
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return { success: false, error: 'Vui lòng đăng nhập' };
    
    try {
      await axios.delete(`${BACKEND_URL}/api/cart`);
      
      dispatch({ type: actionTypes.CLEAR_CART_SUCCESS });
      
      return { success: true, message: 'Đã xóa tất cả sản phẩm trong giỏ hàng' };
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
    return state.totalAmount;
  };

  const isItemInCart = (productId) => {
    return state.items.some(item => item.product_id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product_id === productId);
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