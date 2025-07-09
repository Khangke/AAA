import React from 'react';

// Ultra-simple icon component
const IconWrapper = ({ icon, size = 24, color = 'currentColor', className = '', style = {}, ...props }) => {
  const iconText = (() => {
    switch (icon) {
      case 'home-outline': return '🏠';
      case 'storefront-outline': return '🏪';
      case 'information-circle-outline': return 'ℹ️';
      case 'newspaper-outline': return '📰';
      case 'call-outline': return '📞';
      case 'bag-outline': return '🛍️';
      case 'person-outline': return '👤';
      case 'log-in-outline': return '🔐';
      case 'sparkles': return '✨';
      case 'remove-outline': return '−';
      case 'add-outline': return '+';
      case 'bag-add-outline': return '🛒';
      case 'flash-outline': return '⚡';
      case 'refresh-outline': return '↻';
      case 'close-outline': return '×';
      case 'trash-outline': return '🗑️';
      case 'card-outline': return '💳';
      case 'arrow-back-outline': return '←';
      case 'checkmark-outline': return '✓';
      case 'create-outline': return '✎';
      case 'log-out-outline': return '←';
      case 'send-outline': return '→';
      case 'location-outline': return '📍';
      case 'mail-outline': return '✉';
      case 'time-outline': return '⏰';
      case 'eye-outline': return '👁';
      case 'arrow-forward-outline': return '→';
      case 'chatbubble-outline': return '💬';
      case 'star': return '★';
      case 'star-outline': return '☆';
      default: return '●';
    }
  })();

  return (
    <span
      className={className}
      style={{
        fontSize: `${size}px`,
        color: color,
        display: 'inline-block',
        lineHeight: '1',
        verticalAlign: 'middle',
        ...style
      }}
      {...props}
    >
      {iconText}
    </span>
  );
};

export default IconWrapper;