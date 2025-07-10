import React from 'react';

const IonIcon = ({ icon, size = 24, color = 'currentColor', className = '', ...props }) => {
  return (
    <ion-icon
      icon={icon}
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