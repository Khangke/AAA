import React, { useEffect } from 'react';

const IonIcon = ({ icon, size = 24, color = 'currentColor', className = '', ...props }) => {
  useEffect(() => {
    // Load ionicons dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/ionicons@8.0.0/dist/ionicons/ionicons.esm.js';
    script.type = 'module';
    if (!document.querySelector('script[src*="ionicons"]')) {
      document.head.appendChild(script);
    }
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