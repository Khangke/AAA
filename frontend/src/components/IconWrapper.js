import React from 'react';

// Simple icon component using text symbols and CSS
const IconWrapper = ({ icon, size = 24, color = 'currentColor', className = '', ...props }) => {
  // Icon mapping to Unicode symbols and CSS
  const iconMap = {
    'home-outline': '🏠',
    'storefront-outline': '🏪', 
    'information-circle-outline': 'ℹ️',
    'newspaper-outline': '📰',
    'call-outline': '📞',
    'bag-outline': '🛍️',
    'person-outline': '👤',
    'log-in-outline': '🔐',
    'sparkles': '✨',
    'remove-outline': '➖',
    'add-outline': '➕',
    'bag-add-outline': '🛒',
    'flash-outline': '⚡',
    'refresh-outline': '🔄',
    'close-outline': '❌',
    'trash-outline': '🗑️',
    'card-outline': '💳',
    'arrow-back-outline': '←',
    'checkmark-outline': '✅',
    'create-outline': '✏️',
    'log-out-outline': '🚪',
    'send-outline': '📤',
    'location-outline': '📍',
    'mail-outline': '📧',
    'time-outline': '⏰',
    'eye-outline': '👁️',
    'arrow-forward-outline': '→',
    'chatbubble-outline': '💬',
    'star': '⭐',
    'star-outline': '☆'
  };

  const iconSymbol = iconMap[icon] || '●';

  return (
    <span
      style={{
        fontSize: `${size}px`,
        color: color,
        verticalAlign: 'middle',
        display: 'inline-block',
        lineHeight: 1,
        fontFamily: 'emoji',
      }}
      className={className}
      {...props}
    >
      {iconSymbol}
    </span>
  );
};

export default IconWrapper;