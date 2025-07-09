import React, { useEffect } from 'react';

const IonIcon = ({ icon, size = 24, color = 'currentColor', className = '', ...props }) => {
  useEffect(() => {
    // Load ionicons from local package
    import('ionicons/icons').then((icons) => {
      // Icons are loaded
    });
  }, []);

  return (
    <ion-icon
      name={icon}
      style={{
        fontSize: `${size}px`,
        color: color,
        verticalAlign: 'middle',
        display: 'inline-block',
        lineHeight: 1,
      }}
      className={className}
      {...props}
    />
  );
};

export default IonIcon;