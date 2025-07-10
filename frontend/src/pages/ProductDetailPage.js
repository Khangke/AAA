import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import cachedAPI from '../services/api';
import { ProductDetailSkeleton } from '../components/Skeleton';
import IonIcon from '../components/IonIcon';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useNotification();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAutoSwipe, setIsAutoSwipe] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Auto-swipe functionality
  useEffect(() => {
    if (!product?.images || product.images.length <= 1 || !isAutoSwipe) return;
    
    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [product, isAutoSwipe]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await cachedAPI.getProductById(id);
      setProduct(response);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, quantity);
      showSuccess(`Đã thêm ${product.name} vào giỏ hàng!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, quantity);
      navigate('/cart');
    } catch (error) {
      console.error('Error in buy now:', error);
      showError('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  const adjustQuantity = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product?.stock || 999)));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchProduct}
              className="bg-luxury-gold text-deep-black px-6 py-3 rounded-full font-bold hover:bg-luxury-copper transition-colors"
            >
              Thử Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sản phẩm không tồn tại</h1>
          <button 
            onClick={() => navigate('/products')}
            className="bg-luxury-gold text-deep-black px-6 py-3 rounded-full font-bold hover:bg-luxury-copper transition-colors"
          >
            Về Trang Sản Phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[4/3] bg-white/5 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Auto-swipe controls */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <button
                onClick={() => setIsAutoSwipe(!isAutoSwipe)}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                {isAutoSwipe ? '⏸️' : '▶️'}
              </button>
              <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                {selectedImageIndex + 1}/{product.images.length}
              </div>
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImageIndex(index);
                  setIsAutoSwipe(false);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  index === selectedImageIndex
                    ? 'border-luxury-gold'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-luxury-gold mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <IonIcon
                    key={i}
                    icon={i < Math.floor(product.rating) ? "star" : "star-outline"}
                    size={16}
                    color="#D4AF37"
                  />
                ))}
                <span className="text-gray-300 text-sm ml-2">({product.rating})</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-400">Danh mục: {product.category}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-luxury-gold">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">
              Tình trạng: <span className="text-green-400">Còn {product.stock} sản phẩm</span>
            </p>
          </div>

          {/* Quantity */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Số lượng</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-white/20 rounded-lg">
                <button
                  onClick={() => adjustQuantity(-1)}
                  className="p-3 hover:bg-white/10 transition-colors flex items-center justify-center"
                  disabled={quantity <= 1}
                >
                  <IonIcon icon="remove-outline" size={20} color={quantity <= 1 ? "#666" : "#fff"} />
                </button>
                <span className="px-4 py-3 text-center min-w-[60px] text-white font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => adjustQuantity(1)}
                  className="p-3 hover:bg-white/10 transition-colors flex items-center justify-center"
                  disabled={quantity >= product.stock}
                >
                  <IonIcon icon="add-outline" size={20} color={quantity >= product.stock ? "#666" : "#fff"} />
                </button>
              </div>
              <span className="text-gray-400 text-sm">
                Còn lại: {product.stock}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-transparent border-2 border-luxury-gold text-luxury-gold px-6 py-3 rounded-full font-bold hover:bg-luxury-gold hover:text-deep-black transition-colors flex items-center justify-center space-x-2"
              >
                <IconWrapper icon="bag-add-outline" size={20} />
                <span>Thêm vào giỏ hàng</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-luxury-gold/30 transition-all flex items-center justify-center space-x-2"
              >
                <IconWrapper icon="flash-outline" size={20} color="#1a1a1a" />
                <span>Mua Ngay</span>
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Thông tin chi tiết</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Xuất xứ:</span>
                <span className="text-white">{product.origin || 'Việt Nam'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trọng lượng:</span>
                <span className="text-white">{product.weight || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kích thước:</span>
                <span className="text-white">{product.dimensions || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Chất liệu:</span>
                <span className="text-white">{product.material || 'Trầm hương tự nhiên'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;