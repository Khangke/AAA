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
      className="bg-deep-black/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => onClick && onClick(product)}
    >
      {/* Product Image */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-luxury-gold/20 to-luxury-copper/20 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          draggable="false"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discount}%
          </div>
        )}
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-luxury-gold text-deep-black px-2 py-1 rounded-full text-xs font-bold">
            Nổi Bật
          </div>
        )}
        
        {/* Stock Status */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-deep-black/70 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Hết Hàng</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-luxury text-lg font-bold text-luxury-gold mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Product Description */}
        <p className="text-soft-gold text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-400'}>
                ⭐
              </span>
            ))}
          </div>
          <span className="text-soft-gold text-xs ml-2">
            ({product.reviews_count} đánh giá)
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-luxury-gold font-bold text-lg">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-soft-gold/60 text-sm line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button 
            className="bg-luxury-gold text-deep-black px-4 py-2 rounded-full font-bold text-sm hover:bg-luxury-copper transition-colors min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product.in_stock}
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
              console.log('Add to cart:', product.id);
            }}
          >
            {product.in_stock ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
          </button>
        </div>
        
        {/* Category Tag */}
        <div className="mt-3">
          <span className="inline-block bg-luxury-gold/20 text-luxury-gold px-3 py-1 rounded-full text-xs">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;