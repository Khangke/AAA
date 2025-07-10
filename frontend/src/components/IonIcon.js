import React, { useEffect } from 'react';
import { defineCustomElements } from 'ionicons/loader';

const IonIcon = ({ icon, size = 24, color = 'currentColor', className = '', ...props }) => {
  useEffect(() => {
    // Load ionicons from node_modules
    defineCustomElements();
  }, []);

  return (
    <ion-icon
      name={icon}
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