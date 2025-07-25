import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IonIcon from '../components/IonIcon';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CartPage = () => {
  const { 
    items, 
    getSubtotal, 
    getShippingFee, 
    getCartTotal, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    isGuest 
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showCartNotification, showOrderSuccess, showError } = useNotification();
  const navigate = useNavigate();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Guest checkout form data
  const [guestInfo, setGuestInfo] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    payment_method: 'cod'
  });

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      const result = await removeFromCart(productId);
      // Notification is already shown in removeFromCart function
    } else {
      const result = await updateCartItem(productId, newQuantity);
      // Notification is already shown in updateCartItem function
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    // Notification is already shown in removeFromCart function
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateGuestInfo = () => {
    const { full_name, email, phone, address } = guestInfo;
    if (!full_name.trim()) return 'Vui lòng nhập họ và tên';
    if (!email.trim()) return 'Vui lòng nhập email';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email không hợp lệ';
    if (!phone.trim()) return 'Vui lòng nhập số điện thoại';
    if (!/^[0-9]{10,11}$/.test(phone.replace(/[^0-9]/g, ''))) return 'Số điện thoại không hợp lệ';
    if (!address.trim()) return 'Vui lòng nhập địa chỉ';
    return null;
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setCheckoutMessage('Giỏ hàng của bạn đang trống');
      return;
    }

    // Validate guest info if not authenticated
    if (isGuest && !isAuthenticated) {
      const validationError = validateGuestInfo();
      if (validationError) {
        setCheckoutMessage(validationError);
        return;
      }
    }

    setIsCheckingOut(true);
    setCheckoutMessage('');

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image_url: item.image_url || item.images?.[0] || ''
        })),
        payment_method: guestInfo.payment_method,
        customer_info: isGuest && !isAuthenticated ? {
          full_name: guestInfo.full_name,
          email: guestInfo.email,
          phone: guestInfo.phone
        } : {},
        shipping_address: isGuest && !isAuthenticated ? {
          address: guestInfo.address
        } : {},
        notes: isGuest && !isAuthenticated ? (guestInfo.note || '') : ''
      };

      const response = await axios.post(`${BACKEND_URL}/api/orders`, orderData);
      
      // Show success notification
      showOrderSuccess({ orderId: response.data.id });
      
      // Clear cart after successful order
      await clearCart();
      
      // Reset guest info
      if (isGuest && !isAuthenticated) {
        setGuestInfo({
          full_name: '',
          email: '',
          phone: '',
          address: '',
          note: '',
          payment_method: 'cod'
        });
      }
      
      setShowCheckout(false);
      
      // Navigate to order success page with order data
      navigate('/order-success', { 
        state: { 
          orderData: response.data
        }
      });
      
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.';
      setCheckoutMessage(errorMessage);
      showError(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-deep-black mobile-nav-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-4">
              Giỏ Hàng
            </h1>
            <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-6">
              <span className="text-4xl mb-3 block">🛒</span>
              <h2 className="text-lg font-bold text-luxury-gold mb-3">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-soft-gold mb-4 text-sm">
                Hãy khám phá các sản phẩm trầm hương cao cấp của chúng tôi
              </p>
              <a
                href="/products"
                className="inline-block bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] text-sm"
              >
                Mua Sắm Ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-deep-black mobile-nav-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-2">
            Giỏ Hàng ({items.length} sản phẩm)
          </h1>
          {isGuest && !isAuthenticated && (
            <p className="text-soft-gold text-xs">
              💡 Bạn đang mua sắm dưới dạng khách. Đăng nhập để lưu thông tin và đặt hàng dễ dàng hơn.
            </p>
          )}
        </div>

        {checkoutMessage && (
          <div className={`mb-4 p-3 rounded-lg text-center text-sm ${
            checkoutMessage.includes('thành công') 
              ? 'bg-green-900/30 border border-green-500/30 text-green-300'
              : 'bg-red-900/30 border border-red-500/30 text-red-300'
          }`}>
            {checkoutMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || '/placeholder-image.jpg'}
                      alt={item.name}
                      className="w-full sm:w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-luxury-gold text-base mb-1">
                      {item.name}
                    </h3>
                    <p className="text-soft-gold text-xs mb-2">
                      {formatPrice(item.price)} / sản phẩm
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-luxury-gold/20 border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/30 transition-colors flex items-center justify-center text-sm"
                        >
                          <IonIcon icon="remove-outline" size={14} />
                        </button>
                        <span className="text-white font-medium min-w-[1.5rem] text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-luxury-gold/20 border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/30 transition-colors flex items-center justify-center text-sm"
                        >
                          <IonIcon icon="add-outline" size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-luxury-gold font-bold text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 text-xs underline flex items-center space-x-1"
                        >
                          <IonIcon icon="trash-outline" size={14} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            
            {/* Summary Card */}
            <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-3 sm:p-4 sticky top-20">
              <h2 className="font-luxury text-lg font-bold text-luxury-gold mb-3">
                Tóm Tắt Đơn Hàng
              </h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-soft-gold text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-soft-gold text-sm">
                  <span>Phí vận chuyển:</span>
                  <span>{formatPrice(getShippingFee())}</span>
                </div>
                <div className="border-t border-luxury-gold/20 pt-2">
                  <div className="flex justify-between text-luxury-gold font-bold text-base">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>
              
              {!showCheckout && (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] text-sm flex items-center justify-center space-x-2"
                >
                  <IonIcon icon="card-outline" size={18} color="#1a1a1a" />
                  <span>Tiến Hành Thanh Toán</span>
                </button>
              )}
            </div>

            {/* Checkout Form */}
            {showCheckout && (
              <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-3 sm:p-4">
                <h3 className="font-luxury text-base font-bold text-luxury-gold mb-3">
                  Thông Tin Đặt Hàng
                </h3>
                
                {/* Show user info if authenticated */}
                {isAuthenticated && user ? (
                  <div className="space-y-2 mb-4">
                    <p className="text-soft-gold text-sm">
                      <strong>Khách hàng:</strong> {user.full_name}
                    </p>
                    <p className="text-soft-gold text-sm">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-soft-gold text-sm">
                      <strong>SĐT:</strong> {user.phone}
                    </p>
                    {user.address && (
                      <p className="text-soft-gold text-sm">
                        <strong>Địa chỉ:</strong> {user.address}
                      </p>
                    )}
                  </div>
                ) : (
                  /* Guest checkout form */
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-luxury-gold font-medium mb-1 text-xs">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={guestInfo.full_name}
                        onChange={handleGuestInfoChange}
                        className="w-full px-3 py-2 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 text-xs"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-luxury-gold font-medium mb-1 text-xs">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={guestInfo.email}
                          onChange={handleGuestInfoChange}
                          className="w-full px-3 py-2 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 text-xs"
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-luxury-gold font-medium mb-1 text-xs">
                          Số Điện Thoại *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={guestInfo.phone}
                          onChange={handleGuestInfoChange}
                          className="w-full px-3 py-2 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 text-xs"
                          placeholder="0123 456 789"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-luxury-gold font-medium mb-1 text-xs">
                        Địa Chỉ Giao Hàng *
                      </label>
                      <textarea
                        name="address"
                        value={guestInfo.address}
                        onChange={handleGuestInfoChange}
                        rows="2"
                        className="w-full px-3 py-2 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 text-xs resize-none"
                        placeholder="Nhập địa chỉ giao hàng đầy đủ"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-luxury-gold font-medium mb-1 text-xs">
                        Ghi Chú (Tùy chọn)
                      </label>
                      <textarea
                        name="note"
                        value={guestInfo.note}
                        onChange={handleGuestInfoChange}
                        rows="2"
                        className="w-full px-3 py-2 bg-deep-black/50 border border-luxury-gold/30 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 text-xs resize-none"
                        placeholder="Ghi chú đặc biệt cho đơn hàng"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div className="mb-4">
                  <label className="block text-luxury-gold font-medium mb-2 text-xs">
                    Phương Thức Thanh Toán
                  </label>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={guestInfo.payment_method === 'cod'}
                        onChange={handleGuestInfoChange}
                        className="text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="text-soft-gold text-xs">
                        💵 Thanh toán khi nhận hàng (COD)
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={guestInfo.payment_method === 'bank_transfer'}
                        onChange={handleGuestInfoChange}
                        className="text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="text-soft-gold text-xs">
                        🏦 Chuyển khoản ngân hàng
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 bg-charcoal border border-luxury-gold/30 text-soft-gold px-3 py-2 rounded-lg font-medium hover:bg-luxury-gold/10 transition-colors text-xs flex items-center justify-center space-x-1"
                  >
                    <IonIcon icon="arrow-back-outline" size={14} />
                    <span>Quay Lại</span>
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="flex-1 bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-3 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xs flex items-center justify-center space-x-1"
                  >
                    <IonIcon icon="checkmark-outline" size={14} color="#1a1a1a" />
                    <span>{isCheckingOut ? 'Đang Xử Lý...' : 'Đặt Hàng'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;