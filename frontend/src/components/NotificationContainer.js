import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500/30 text-green-300';
      case 'error':
        return 'bg-red-900/90 border-red-500/30 text-red-300';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-500/30 text-yellow-300';
      case 'info':
      default:
        return 'bg-blue-900/90 border-blue-500/30 text-blue-300';
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full pointer-events-none md:max-w-sm sm:max-w-full sm:left-4 sm:right-4">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationColors(notification.type)}
            backdrop-blur-sm rounded-lg border p-3 pr-10 
            shadow-lg shadow-black/50 
            transform transition-all duration-300 
            animate-slide-in-right
            relative
            pointer-events-auto
            w-full
            sm:max-w-none
          `}
        >
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </span>
            <p className="text-sm font-medium leading-tight flex-1 break-words">
              {notification.message}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => removeNotification(notification.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer touch-target"
            aria-label="Đóng thông báo"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;