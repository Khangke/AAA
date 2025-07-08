import React from 'react';

const ProductCard = ({ product, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const discount = calculateDiscount(product.original_price, product.price);

  return (
    <div 
      className="bg-deep-black/50 rounded-xl overflow-hidden backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => onClick && onClick(product)}
    >
      {/* Product Image */}
      <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-br from-luxury-gold/20 to-luxury-copper/20 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          draggable="false"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded-md text-2xs font-bold">
            -{discount}%
          </div>
        )}
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-1 right-1 bg-luxury-gold text-deep-black px-1.5 py-0.5 rounded-md text-2xs font-bold">
            Nổi Bật
          </div>
        )}
        
        {/* Stock Status */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-deep-black/70 flex items-center justify-center">
            <span className="text-white font-bold text-xs">Hết Hàng</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 md:p-4">
        {/* Product Name */}
        <h3 className="font-luxury text-sm sm:text-base md:text-lg font-bold text-luxury-gold mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        {/* Product Description - Hidden on mobile for space */}
        <p className="text-soft-gold text-2xs sm:text-xs md:text-sm mb-2 line-clamp-1 hidden sm:block">
          {product.description}
        </p>
        
        {/* Rating - Compact version */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 text-xs sm:text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-400'}>
                ⭐
              </span>
            ))}
          </div>
          <span className="text-soft-gold text-2xs sm:text-xs ml-1">
            ({product.reviews_count})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-luxury-gold font-bold text-sm sm:text-base md:text-lg">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-soft-gold/60 text-2xs sm:text-xs line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button - Full width on mobile */}
        <button 
          className="w-full bg-luxury-gold text-deep-black px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-luxury-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!product.in_stock}
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
            console.log('Buy now:', product.id);
          }}
        >
          {product.in_stock ? 'Mua Ngay' : 'Hết Hàng'}
        </button>
        
        {/* Category Tag - Compact */}
        <div className="mt-2">
          <span className="inline-block bg-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded-md text-2xs sm:text-xs">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;