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
      {/* Product Image - Square aspect ratio */}
      <div className="relative aspect-square bg-gradient-to-br from-luxury-gold/20 to-luxury-copper/20 flex items-center justify-center overflow-hidden">
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
      <div className="p-3 space-y-2">
        {/* Product Name */}
        <h3 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Product Description - Show on mobile with line clamp */}
        <p className="text-soft-gold text-xs leading-tight line-clamp-2 mb-2">
          {product.description}
        </p>
        
        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-500'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-soft-gold text-xs ml-1">
              ({product.reviews_count})
            </span>
          </div>
          <div className="text-xs text-soft-gold">
            {product.rating}/5
          </div>
        </div>
        
        {/* Price Section */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-luxury-gold font-bold text-base">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-soft-gold/60 text-xs line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <div className="text-green-400 text-xs font-semibold">
              Tiết kiệm {formatPrice(product.original_price - product.price)}
            </div>
          )}
        </div>
        
        {/* Stock Info */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-soft-gold text-xs">
            Còn lại: {product.stock_quantity} sản phẩm
          </span>
          {product.stock_quantity <= 5 && (
            <span className="text-red-400 text-xs font-semibold">
              Sắp hết hàng!
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button 
          className="w-full bg-luxury-gold text-deep-black px-3 py-2 rounded-lg font-bold text-sm hover:bg-luxury-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          disabled={!product.in_stock}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Buy now:', product.id);
          }}
        >
          {product.in_stock ? 'Mua Ngay' : 'Hết Hàng'}
        </button>
        
        {/* Category Tag */}
        <div className="flex justify-center mt-2">
          <span className="inline-block bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded-full text-xs">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;