import React from 'react';

// Simple CSS-based icon component
const IconWrapper = ({ icon, size = 24, color = 'currentColor', className = '', ...props }) => {
  // Simple CSS-based icons using pseudo-elements
  const getIconStyles = (iconName) => {
    const baseStyle = {
      display: 'inline-block',
      width: `${size}px`,
      height: `${size}px`,
      color: color,
      verticalAlign: 'middle',
      lineHeight: 1,
      fontSize: `${size}px`,
      textAlign: 'center',
    };

    // Simple text-based icons for reliability
    const icons = {
      'home-outline': { ...baseStyle, content: '⌂' },
      'storefront-outline': { ...baseStyle, content: '⛪' },
      'information-circle-outline': { ...baseStyle, content: 'i' },
      'newspaper-outline': { ...baseStyle, content: '📄' },
      'call-outline': { ...baseStyle, content: '☎' },
      'bag-outline': { ...baseStyle, content: '🎒' },
      'person-outline': { ...baseStyle, content: '👤' },
      'log-in-outline': { ...baseStyle, content: '→' },
      'sparkles': { ...baseStyle, content: '✨' },
      'remove-outline': { ...baseStyle, content: '−' },
      'add-outline': { ...baseStyle, content: '+' },
      'bag-add-outline': { ...baseStyle, content: '🛒' },
      'flash-outline': { ...baseStyle, content: '⚡' },
      'refresh-outline': { ...baseStyle, content: '↻' },
      'close-outline': { ...baseStyle, content: '×' },
      'trash-outline': { ...baseStyle, content: '🗑' },
      'card-outline': { ...baseStyle, content: '💳' },
      'arrow-back-outline': { ...baseStyle, content: '←' },
      'checkmark-outline': { ...baseStyle, content: '✓' },
      'create-outline': { ...baseStyle, content: '✎' },
      'log-out-outline': { ...baseStyle, content: '←' },
      'send-outline': { ...baseStyle, content: '→' },
      'location-outline': { ...baseStyle, content: '📍' },
      'mail-outline': { ...baseStyle, content: '✉' },
      'time-outline': { ...baseStyle, content: '⏰' },
      'eye-outline': { ...baseStyle, content: '👁' },
      'arrow-forward-outline': { ...baseStyle, content: '→' },
      'chatbubble-outline': { ...baseStyle, content: '💬' },
      'star': { ...baseStyle, content: '★' },
      'star-outline': { ...baseStyle, content: '☆' }
    };

    return icons[iconName] || icons['home-outline'];
  };

  const iconStyle = getIconStyles(icon);

  return (
    <span
      style={iconStyle}
      className={className}
      {...props}
    >
      {iconStyle.content}
    </span>
  );
};

export default IconWrapper;