import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-deep-black/60 rounded-lg overflow-hidden backdrop-blur-sm border border-luxury-gold/20 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-800"></div>
      
      {/* Content skeleton */}
      <div className="p-2 sm:p-3 space-y-2">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
        
        {/* Description skeleton */}
        <div className="space-y-1">
          <div className="h-3 bg-gray-800 rounded w-full"></div>
          <div className="h-3 bg-gray-800 rounded w-2/3"></div>
        </div>
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-800 rounded w-16"></div>
          <div className="h-3 bg-gray-800 rounded w-8"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        
        {/* Button skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-800 rounded"></div>
          <div className="h-8 bg-gray-800 rounded"></div>
        </div>
        
        {/* Category skeleton */}
        <div className="flex justify-center">
          <div className="h-6 bg-gray-800 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
};

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {[...Array(count)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

const ProductDetailSkeleton = () => {
  return (
    <div className="pt-14 md:pt-20 bg-deep-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-16 h-16 bg-gray-800 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-800 rounded w-3/4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="h-6 bg-gray-800 rounded w-1/2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-10 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageLoadingSkeleton = () => {
  return (
    <div className="pt-16 md:pt-20 bg-deep-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-800 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded w-96 animate-pulse"></div>
        </div>
        
        {/* Filters skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-10 bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
        
        {/* Products grid skeleton */}
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
};

export {
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductDetailSkeleton,
  PageLoadingSkeleton
};