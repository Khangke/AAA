import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import LazyImage from '../components/LazyImage';
import { ProductDetailSkeleton } from '../components/Skeleton';
import cachedAPI from '../services/api';
import IonIcon from '../components/IonIcon';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showError } = useNotification();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Auto-swipe functionality
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1 || !isAutoPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setSelectedImageIndex(prev => (prev + 1) % product.images.length);
    }, 3000); // Auto-swipe every 3 seconds

    return () => clearInterval(interval);
  }, [product, isAutoPlaying]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await cachedAPI.getProductById(id);
      setProduct(productData);
      
      // Set default variation (first one or none if no variations)
      if (productData.variations && productData.variations.length > 0) {
        setSelectedVariation(productData.variations[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCurrentPrice = () => {
    if (selectedVariation) {
      return selectedVariation.price;
    }
    return product?.price || 0;
  };

  const getCurrentOriginalPrice = () => {
    if (selectedVariation) {
      return selectedVariation.original_price;
    }
    return product?.original_price;
  };

  const getDiscountPercentage = () => {
    const currentPrice = getCurrentPrice();
    const originalPrice = getCurrentOriginalPrice();
    
    if (originalPrice && originalPrice > currentPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const getAvailableStock = () => {
    if (selectedVariation) {
      return selectedVariation.stock_quantity;
    }
    return product?.stock_quantity || 0;
  };

  const handleVariationChange = (variation) => {
    setSelectedVariation(variation);
    setQuantity(1); // Reset quantity when changing variation
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: getCurrentPrice(),
      image: product.image_url,
      quantity: quantity,
      variation: selectedVariation ? selectedVariation.size : null
    };

    try {
      await addToCart(cartItem);
      // Notification is already shown in CartContext
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: getCurrentPrice(),
      image: product.image_url,
      quantity: quantity,
      variation: selectedVariation ? selectedVariation.size : null
    };

    try {
      await addToCart(cartItem);
      // Notification is already shown in CartContext
      // Navigate to cart page after adding to cart
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    
    // Resume auto-play after 5 seconds of no interaction
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-luxury-gold' : 'text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-14 md:pt-20 bg-deep-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-4xl mb-4">❌</div>
            <h2 className="text-luxury-gold text-xl sm:text-2xl font-bold mb-4">
              {error || 'Không tìm thấy sản phẩm'}
            </h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
            >
              Quay lại trang sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentImages = product.images && product.images.length > 0 ? product.images : [product.image_url];

  return (
    <div className="min-h-screen pt-14 md:pt-20 bg-deep-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-soft-gold">
            <li>
              <button 
                onClick={() => navigate('/')}
                className="hover:text-luxury-gold transition-colors"
              >
                Trang chủ
              </button>
            </li>
            <li className="text-luxury-gold/60">›</li>
            <li>
              <button 
                onClick={() => navigate('/products')}
                className="hover:text-luxury-gold transition-colors"
              >
                Sản phẩm
              </button>
            </li>
            <li className="text-luxury-gold/60">›</li>
            <li className="text-luxury-gold font-medium truncate">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          
          {/* Product Images - Made smaller and optimized */}
          <div className="space-y-2 sm:space-y-3">
            {/* Main Image - Reduced size */}
            <div className="relative bg-charcoal/30 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <LazyImage
                src={currentImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full cursor-pointer"
                onClick={() => handleImageClick(selectedImageIndex)}
              />
              
              {/* Discount Badge */}
              {getDiscountPercentage() > 0 && (
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{getDiscountPercentage()}%
                </div>
              )}

              {/* Auto-play indicator */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                {selectedImageIndex + 1} / {currentImages.length}
              </div>

              {/* Auto-play toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs hover:bg-black/70 transition-colors"
              >
                {isAutoPlaying ? '⏸️' : '▶️'}
              </button>
            </div>

            {/* Thumbnail Images - Optimized for mobile */}
            {currentImages.length > 1 && (
              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide">
                {currentImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`flex-shrink-0 w-12 sm:w-16 h-12 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index 
                        ? 'border-luxury-gold' 
                        : 'border-luxury-gold/30 hover:border-luxury-gold/60'
                    }`}
                  >
                    <LazyImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Product Title & Rating */}
            <div>
              <h1 className="font-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-luxury-gold mb-2 sm:mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(Math.floor(product.rating))}
                  </div>
                  <span className="text-soft-gold text-sm">
                    ({product.reviews_count} đánh giá)
                  </span>
                </div>
                
                <div className="text-right">
                  <span className="text-soft-gold text-xs sm:text-sm">Danh mục:</span>
                  <span className="text-luxury-gold font-medium text-sm sm:text-base ml-1">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-charcoal/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-baseline space-x-3">
                <span className="font-luxury text-2xl sm:text-3xl font-bold text-luxury-gold">
                  {formatPrice(getCurrentPrice())}
                </span>
                {getCurrentOriginalPrice() && getCurrentOriginalPrice() > getCurrentPrice() && (
                  <span className="text-soft-gold/60 line-through text-lg sm:text-xl">
                    {formatPrice(getCurrentOriginalPrice())}
                  </span>
                )}
              </div>
              
              {getDiscountPercentage() > 0 && (
                <p className="text-green-400 text-sm sm:text-base font-medium mt-1">
                  Tiết kiệm {formatPrice(getCurrentOriginalPrice() - getCurrentPrice())} ({getDiscountPercentage()}%)
                </p>
              )}
            </div>

            {/* Size Variations */}
            {product.variations && product.variations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-luxury-gold text-base sm:text-lg">
                  Chọn kích thước:
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {product.variations.map((variation, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariationChange(variation)}
                      disabled={variation.stock_quantity === 0}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 text-sm sm:text-base ${
                        selectedVariation?.size === variation.size
                          ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                          : variation.stock_quantity === 0
                          ? 'border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed'
                          : 'border-luxury-gold/30 hover:border-luxury-gold/60 text-soft-gold hover:text-luxury-gold'
                      }`}
                    >
                      <div className="font-medium">{variation.size}</div>
                      <div className="text-xs sm:text-sm">
                        {formatPrice(variation.price)}
                      </div>
                      {variation.stock_quantity === 0 && (
                        <div className="text-xs text-red-400 mt-1">Hết hàng</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-soft-gold">Tình trạng:</span>
              <span className={`font-medium ${getAvailableStock() > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {getAvailableStock() > 0 ? `Còn ${getAvailableStock()} sản phẩm` : 'Hết hàng'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            {getAvailableStock() > 0 && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-soft-gold font-medium text-sm sm:text-base">Số lượng:</span>
                  <div className="flex items-center border border-luxury-gold/30 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 sm:px-4 py-2 text-luxury-gold hover:bg-luxury-gold/10 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 sm:px-6 py-2 text-soft-gold font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(getAvailableStock(), quantity + 1))}
                      className="px-3 sm:px-4 py-2 text-luxury-gold hover:bg-luxury-gold/10 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || getAvailableStock() === 0}
                    className="w-full border-2 border-luxury-gold text-luxury-gold bg-transparent px-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-luxury-gold hover:text-deep-black hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                  </button>

                  {/* Buy Now Button - Mobile Optimized */}
                  <button
                    onClick={handleBuyNow}
                    disabled={isAddingToCart || getAvailableStock() === 0}
                    className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isAddingToCart ? 'Đang xử lý...' : '🛒 Mua Ngay'}
                  </button>
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-luxury text-lg sm:text-xl font-bold text-luxury-gold">
                Mô tả sản phẩm
              </h3>
              <div className="bg-charcoal/30 rounded-xl p-3 sm:p-4">
                <p className="text-soft-gold leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-medium text-luxury-gold text-sm sm:text-base">
                  Từ khóa:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-xs sm:text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;