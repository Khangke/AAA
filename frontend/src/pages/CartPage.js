import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CartPage = () => {
  const { items, totalAmount, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderData, setOrderData] = useState({
    paymentMethod: 'cod',
    customerInfo: {
      full_name: '',
      email: '',
      phone: ''
    },
    shippingAddress: {
      address: '',
      city: '',
      district: '',
      ward: ''
    },
    notes: ''
  });
  
  const SHIPPING_FEE = 30000;
  const finalTotal = totalAmount + SHIPPING_FEE;

  useEffect(() => {
    if (user) {
      setOrderData(prev => ({
        ...prev,
        customerInfo: {
          full_name: user.full_name || '',
          email: user.email || '',
          phone: user.phone || ''
        },
        shippingAddress: {
          address: user.address || '',
          city: user.city || '',
          district: user.district || '',
          ward: user.ward || ''
        }
      }));
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      await clearCart();
    }
  };

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateOrderForm = () => {
    const { customerInfo, shippingAddress } = orderData;
    
    if (!customerInfo.full_name || !customerInfo.email || !customerInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin khách hàng');
      return false;
    }
    
    if (!shippingAddress.address || !shippingAddress.city) {
      alert('Vui lòng điền đầy đủ địa chỉ giao hàng');
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateOrderForm()) return;
    
    setIsProcessingOrder(true);
    
    try {
      const orderPayload = {
        items: items,
        payment_method: orderData.paymentMethod,
        customer_info: orderData.customerInfo,
        shipping_address: orderData.shippingAddress,
        notes: orderData.notes
      };
      
      const response = await axios.post(`${BACKEND_URL}/api/orders`, orderPayload);
      
      alert(`Đặt hàng thành công! Mã đơn hàng: ${response.data.order_number}`);
      setShowCheckout(false);
      navigate('/account');
    } catch (error) {
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-deep-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-luxury-gold text-6xl mb-6">🔒</div>
            <h1 className="font-luxury text-3xl md:text-4xl font-bold text-luxury-gold mb-4">
              Vui Lòng Đăng Nhập
            </h1>
            <p className="text-soft-gold text-lg mb-8">
              Bạn cần đăng nhập để xem giỏ hàng
            </p>
            <Link
              to="/account"
              className="inline-block bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105"
            >
              Đăng Nhập Ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-deep-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-luxury-gold text-6xl mb-6 animate-pulse">🛒</div>
            <h2 className="font-luxury text-2xl text-luxury-gold">
              Đang tải giỏ hàng...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-deep-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-luxury-gold text-6xl mb-6">🛒</div>
            <h1 className="font-luxury text-3xl md:text-4xl font-bold text-luxury-gold mb-4">
              Giỏ Hàng Trống
            </h1>
            <p className="text-soft-gold text-lg mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105"
            >
              Khám Phá Sản Phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-deep-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-luxury-gold mb-4">
            Giỏ Hàng
          </h1>
          <p className="text-soft-gold text-base sm:text-lg">
            Bạn có {items.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        {!showCheckout ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-luxury text-lg sm:text-xl font-bold text-luxury-gold mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-soft-gold text-sm sm:text-base mb-4">
                        Giá: {formatPrice(item.price)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-soft-gold">Số lượng:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                              className="w-8 h-8 bg-luxury-gold/20 hover:bg-luxury-gold/30 rounded-full flex items-center justify-center text-luxury-gold transition-colors"
                            >
                              −
                            </button>
                            <span className="text-white font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                              className="w-8 h-8 bg-luxury-gold/20 hover:bg-luxury-gold/30 rounded-full flex items-center justify-center text-luxury-gold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.product_id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-luxury-gold/20">
                        <p className="text-right text-luxury-gold font-bold">
                          Tổng: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Clear Cart Button */}
              <div className="text-center pt-4">
                <button
                  onClick={handleClearCart}
                  className="text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  Xóa tất cả sản phẩm
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-6 sticky top-24">
                <h2 className="font-luxury text-2xl font-bold text-luxury-gold mb-6">
                  Tóm Tắt Đơn Hàng
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-soft-gold">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-soft-gold">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(SHIPPING_FEE)}</span>
                  </div>
                  <div className="border-t border-luxury-gold/20 pt-4">
                    <div className="flex justify-between text-luxury-gold font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Tiến Hành Thanh Toán
                </button>
                
                <Link
                  to="/products"
                  className="block w-full text-center mt-4 text-soft-gold hover:text-luxury-gold transition-colors"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="max-w-4xl mx-auto">
            <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-luxury text-2xl sm:text-3xl font-bold text-luxury-gold">
                  Thông Tin Đặt Hàng
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-soft-gold hover:text-luxury-gold transition-colors"
                >
                  ← Quay lại
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Customer Info */}
                <div>
                  <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-4">
                    Thông Tin Khách Hàng
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-luxury-gold font-medium mb-2">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        value={orderData.customerInfo.full_name}
                        onChange={(e) => handleInputChange('customerInfo', 'full_name', e.target.value)}
                        className="w-full px-4 py-3 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-luxury-gold font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={orderData.customerInfo.email}
                        onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                        className="w-full px-4 py-3 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-luxury-gold font-medium mb-2">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        value={orderData.customerInfo.phone}
                        onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                        className="w-full px-4 py-3 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                        placeholder="0123 456 789"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Shipping Address */}
                <div>
                  <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-4">
                    Địa Chỉ Giao Hàng
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-luxury-gold font-medium mb-2">
                        Địa Chỉ *
                      </label>
                      <input
                        type="text"
                        value={orderData.shippingAddress.address}
                        onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)}
                        className="w-full px-4 py-3 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                        placeholder="Số nhà, tên đường"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-luxury-gold font-medium mb-2">
                          Phường/Xã *
                        </label>
                        <input
                          type="text"
                          value={orderData.shippingAddress.ward}
                          onChange={(e) => handleInputChange('shippingAddress', 'ward', e.target.value)}
                          className="w-full px-4 py-3 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                          placeholder="Phường/Xã"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-luxury-gold font-medium mb-2">
                          Quận/Huyện
                        </label>
                        <input
                          type="text"
                          value={orderData.shippingAddress.district}
                          onChange={(e) => handleInputChange('shippingAddress', 'district', e.target.value)}
                          className="w-full px-4 py-3 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                          placeholder="Quận/Huyện"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-luxury-gold font-medium mb-2">
                        Tỉnh/Thành Phố *
                      </label>
                      <input
                        type="text"
                        value={orderData.shippingAddress.city}
                        onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                        className="w-full px-4 py-3 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                        placeholder="Tỉnh/Thành phố"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="mt-8">
                <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-4">
                  Phương Thức Thanh Toán
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center p-4 bg-deep-black/50 border border-luxury-gold/30 rounded-lg cursor-pointer hover:border-luxury-gold/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={orderData.paymentMethod === 'cod'}
                      onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="mr-3 text-luxury-gold focus:ring-luxury-gold"
                    />
                    <div>
                      <div className="font-medium text-luxury-gold">💵 Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-soft-gold">Thanh toán bằng tiền mặt</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 bg-deep-black/50 border border-luxury-gold/30 rounded-lg cursor-pointer hover:border-luxury-gold/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={orderData.paymentMethod === 'bank_transfer'}
                      onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="mr-3 text-luxury-gold focus:ring-luxury-gold"
                    />
                    <div>
                      <div className="font-medium text-luxury-gold">🏦 Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-soft-gold">Chuyển khoản trước khi giao</div>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Notes */}
              <div className="mt-8">
                <label className="block text-luxury-gold font-medium mb-2">
                  Ghi Chú
                </label>
                <textarea
                  value={orderData.notes}
                  onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-3 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 resize-none"
                  placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                ></textarea>
              </div>
              
              {/* Order Summary */}
              <div className="mt-8 p-6 bg-deep-black/50 rounded-lg border border-luxury-gold/20">
                <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-4">
                  Tóm Tắt Đơn Hàng
                </h3>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex justify-between text-soft-gold">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-luxury-gold/20 pt-4 space-y-2">
                  <div className="flex justify-between text-soft-gold">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-soft-gold">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(SHIPPING_FEE)}</span>
                  </div>
                  <div className="flex justify-between text-luxury-gold font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
              
              {/* Place Order Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessingOrder}
                  className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessingOrder ? 'Đang Xử Lý...' : 'Đặt Hàng'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;