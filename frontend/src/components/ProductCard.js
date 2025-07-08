import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onClick }) => {
  const { addToCart, isItemInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { showCartNotification, showError } = useNotification();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    const result = await addToCart(product, 1);
    
    if (result.success) {
      // Optionally show a success notification
      console.log('Added to cart successfully');
    } else {
      alert(result.error || 'Không thể thêm vào giỏ hàng');
    }
    
    setIsAddingToCart(false);
  };

  const discount = calculateDiscount(product.original_price, product.price);
  const itemInCart = isItemInCart(product.id);
  const itemQuantity = getItemQuantity(product.id);

  return (
    <div 
      className="bg-deep-black/60 rounded-xl overflow-hidden backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-luxury-gold/20"
      onClick={handleCardClick}
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
        
        {/* In Cart Badge */}
        {itemInCart && (
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-1.5 py-0.5 rounded-md text-2xs font-bold">
            Trong giỏ: {itemQuantity}
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
          className={`w-full px-3 py-2 rounded-lg font-bold text-sm transition-all duration-300 shadow-md ${
            !product.in_stock
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : itemInCart
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-luxury-gold hover:bg-luxury-copper text-deep-black'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!product.in_stock || isAddingToCart}
          onClick={handleAddToCart}
        >
          {isAddingToCart 
            ? 'Đang thêm...' 
            : !product.in_stock 
            ? 'Hết Hàng' 
            : itemInCart 
            ? `Thêm nữa (${itemQuantity})` 
            : 'Thêm vào giỏ'
          }
        </button>
        
        {/* Quick Buy Button */}
        {product.in_stock && (
          <button 
            className="w-full bg-transparent border border-luxury-gold text-luxury-gold px-3 py-2 rounded-lg font-bold text-sm hover:bg-luxury-gold hover:text-deep-black transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e).then(() => {
                navigate('/cart');
              });
            }}
          >
            Mua Ngay
          </button>
        )}
        
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