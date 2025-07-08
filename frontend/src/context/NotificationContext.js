import React, { createContext, useContext, useReducer, useEffect } from 'react';

const NotificationContext = React.createContext();

// Initial state
const initialState = {
  notifications: []
};

// Action types
const actionTypes = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL_NOTIFICATIONS: 'CLEAR_ALL_NOTIFICATIONS'
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };
    
    case actionTypes.CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
    
    default:
      return state;
  }
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Auto-remove notification after timeout
  useEffect(() => {
    state.notifications.forEach(notification => {
      if (notification.autoRemove) {
        const timeout = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || 3000);
        
        return () => clearTimeout(timeout);
      }
    });
  }, [state.notifications]);

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info', // info, success, warning, error
      autoRemove: true,
      duration: 3000,
      ...notification
    };
    
    dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: newNotification });
    return id;
  };

  // Remove notification
  const removeNotification = (id) => {
    dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    dispatch({ type: actionTypes.CLEAR_ALL_NOTIFICATIONS });
  };

  // Helper functions for different notification types
  const showSuccess = (message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  };

  const showError = (message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 5000, // Error messages stay longer
      ...options
    });
  };

  const showWarning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  };

  const showInfo = (message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  };

  // Cart specific notifications
  const showCartNotification = (type, productName, quantity = 1) => {
    const messages = {
      add: `✅ Đã thêm ${quantity} ${productName} vào giỏ hàng`,
      remove: `🗑️ Đã xóa ${productName} khỏi giỏ hàng`,
      update: `📝 Đã cập nhật số lượng ${productName} trong giỏ hàng`
    };

    return showSuccess(messages[type] || messages.add);
  };

  // Order specific notifications
  const showOrderSuccess = (orderInfo) => {
    return showSuccess(
      `🎉 Đặt hàng thành công! Mã đơn hàng: ${orderInfo.orderId || 'N/A'}`,
      { duration: 5000 }
    );
  };

  const value = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCartNotification,
    showOrderSuccess
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    console.warn('useNotification must be used within a NotificationProvider');
    // Return empty functions to prevent crashes
    return {
      notifications: [],
      addNotification: () => {},
      removeNotification: () => {},
      clearAllNotifications: () => {},
      showSuccess: () => {},
      showError: () => {},
      showWarning: () => {},
      showInfo: () => {},
      showCartNotification: () => {},
      showOrderSuccess: () => {}
    };
  }
  return context;
};