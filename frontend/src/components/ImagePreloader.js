import React, { useState, useEffect } from 'react';

const ImagePreloader = ({ src, alt, className, onLoad, onError, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setIsError(false);
      onLoad && onLoad();
    };
    
    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
      onError && onError();
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  if (isError) {
    return (
      <div className={`${className} bg-charcoal/50 border border-luxury-gold/20 rounded-lg flex items-center justify-center`}>
        <div className="text-center p-4">
          <span className="text-soft-gold text-2xl mb-2 block">🖼️</span>
          <p className="text-soft-gold text-sm">Không thể tải hình ảnh</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} bg-charcoal/50 border border-luxury-gold/20 rounded-lg flex items-center justify-center animate-pulse`}>
        <div className="text-center p-4">
          <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-soft-gold text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} opacity-0 animate-fade-in`}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
      {...props}
    />
  );
};

export default ImagePreloader;