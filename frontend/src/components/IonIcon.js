import React from 'react';
import { defineCustomElements } from 'ionicons/loader';
import { getIcon } from '../utils/iconMap';

// Initialize ionicons
defineCustomElements();

const IonIcon = ({ icon, size = 24, color = 'currentColor', className = '', ...props }) => {
  // If icon is a string, try to get the mapped icon
  const iconToUse = typeof icon === 'string' ? getIcon(icon) : icon;
  
  return (
    <ion-icon
      icon={iconToUse}
      style={{
        fontSize: `${size}px`,
        color: color,
        display: 'inline-block',
        verticalAlign: 'middle',
        '--ionicon-stroke-width': '32px'
      }}
      className={className}
      {...props}
    />
  );
};

export default IonIcon;