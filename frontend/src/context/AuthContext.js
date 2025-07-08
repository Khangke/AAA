import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token')
};

// Action types
const actionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
    case actionTypes.REGISTER_START:
    case actionTypes.LOAD_USER_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null
      };
    
    case actionTypes.LOAD_USER_SUCCESS:
    case actionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null
      };
    
    case actionTypes.LOGIN_FAILURE:
    case actionTypes.REGISTER_FAILURE:
    case actionTypes.LOAD_USER_FAILURE:
      localStorage.removeItem('token');
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        token: null,
        user: null,
        error: action.payload
      };
    
    case actionTypes.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        error: null
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
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor for auth token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    }
  }, []);

  // API calls
  const login = async (email, password) => {
    dispatch({ type: actionTypes.LOGIN_START });
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { access_token } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Load user data after successful login
      const userResponse = await axios.get(`${BACKEND_URL}/api/auth/me`);
      
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          token: access_token,
          user: userResponse.data
        }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Đăng nhập thất bại';
      dispatch({
        type: actionTypes.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    dispatch({ type: actionTypes.REGISTER_START });
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, userData);
      
      const { access_token } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Load user data after successful registration
      const userResponse = await axios.get(`${BACKEND_URL}/api/auth/me`);
      
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
        payload: {
          token: access_token,
          user: userResponse.data
        }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Đăng ký thất bại';
      dispatch({
        type: actionTypes.REGISTER_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const loadUser = async () => {
    if (!localStorage.getItem('token')) return;
    
    dispatch({ type: actionTypes.LOAD_USER_START });
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`);
      dispatch({
        type: actionTypes.LOAD_USER_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: actionTypes.LOAD_USER_FAILURE,
        payload: 'Không thể tải thông tin người dùng'
      });
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/auth/me`, userData);
      dispatch({
        type: actionTypes.UPDATE_USER_SUCCESS,
        payload: response.data
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Cập nhật thông tin thất bại';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: actionTypes.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;