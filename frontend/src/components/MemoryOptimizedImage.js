import React, { useState, useEffect, useRef } from 'react';

const MemoryOptimizedImage = ({ 
  src, 
  alt, 
  className = '',
  placeholderSrc = null,
  quality = 'auto',
  loading = 'lazy',
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || src);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    // Intersection Observer for lazy loading
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadImage();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (loading === 'lazy') {
      observer.observe(img);
      observerRef.current = observer;
    } else {
      loadImage();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, loading]);

  const loadImage = () => {
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
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
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  if (isError) {
    return (
      <div className={`${className} bg-charcoal/30 border border-luxury-gold/10 rounded-lg flex items-center justify-center`}>
        <div className="text-center p-4">
          <span className="text-soft-gold text-xl mb-2 block">🖼️</span>
          <p className="text-soft-gold text-xs">Không thể tải ảnh</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-70'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={loading}
        {...props}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-charcoal/20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default MemoryOptimizedImage;