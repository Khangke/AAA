import { useEffect } from 'react';
import { preload } from '../utils/cacheManager';
import cachedAPI from '../services/api';

const usePreloadResources = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = async () => {
      // Preload homepage data
      try {
        await cachedAPI.getAllProducts({ limit: 8, featured: true });
        await cachedAPI.getCategories();
      } catch (error) {
        console.log('Preload failed:', error);
      }
    };

    // Preload important images
    const preloadImages = [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ];

    // Wait a bit before preloading to not interfere with initial load
    setTimeout(() => {
      preload(preloadImages);
      preloadCriticalResources();
    }, 1000);
  }, []);
};

export default usePreloadResources;