import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // Redirect to home if no order data
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      default:
        return 'Không xác định';
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen pt-20 bg-deep-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-luxury-gold text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-deep-black mobile-nav-padding">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-900/30 rounded-full border-2 border-green-500/50 mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-luxury-gold mb-2">
            Đặt Hàng Thành Công! 🎉
          </h1>
          <p className="text-soft-gold text-sm sm:text-base">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-luxury-gold mb-4 flex items-center gap-2">
            <span>📋</span>
            Thông Tin Đơn Hàng
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
            <div>
              <p className="text-soft-gold mb-1">Mã đơn hàng:</p>
              <p className="text-luxury-gold font-mono font-bold text-sm sm:text-base">
                {orderData.id || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-soft-gold mb-1">Ngày đặt hàng:</p>
              <p className="text-luxury-gold font-medium">
                {formatDate(orderData.created_at || new Date())}
              </p>
            </div>
            <div>
              <p className="text-soft-gold mb-1">Tổng giá trị:</p>
              <p className="text-luxury-gold font-bold text-lg sm:text-xl">
                {formatPrice(orderData.total_amount || orderData.total)}
              </p>
            </div>
            <div>
              <p className="text-soft-gold mb-1">Phương thức thanh toán:</p>
              <p className="text-luxury-gold font-medium">
                {getPaymentMethodText(orderData.payment_method)}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-luxury-gold mb-4 flex items-center gap-2">
            <span>👤</span>
            Thông Tin Khách Hàng
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
            <div>
              <p className="text-soft-gold mb-1">Họ và tên:</p>
              <p className="text-luxury-gold font-medium">
                {orderData.customer_info?.full_name || orderData.user?.full_name}
              </p>
            </div>
            <div>
              <p className="text-soft-gold mb-1">Email:</p>
              <p className="text-luxury-gold font-medium">
                {orderData.customer_info?.email || orderData.user?.email}
              </p>
            </div>
            <div>
              <p className="text-soft-gold mb-1">Số điện thoại:</p>
              <p className="text-luxury-gold font-medium">
                {orderData.customer_info?.phone || orderData.user?.phone}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-soft-gold mb-1">Địa chỉ giao hàng:</p>
              <p className="text-luxury-gold font-medium">
                {orderData.customer_info?.address || orderData.user?.address}
              </p>
            </div>
            {(orderData.customer_info?.note || orderData.note) && (
              <div className="md:col-span-2">
                <p className="text-soft-gold mb-1">Ghi chú:</p>
                <p className="text-luxury-gold font-medium">
                  {orderData.customer_info?.note || orderData.note}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-luxury-gold mb-4 flex items-center gap-2">
            <span>📦</span>
            Sản Phẩm Đã Đặt
          </h2>
          
          <div className="space-y-4">
            {orderData.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-deep-black/30 rounded-lg">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                  <span className="text-luxury-gold text-lg sm:text-xl">📿</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-luxury-gold font-medium text-sm sm:text-base">
                    {item.name || `Sản phẩm ${item.product_id}`}
                  </h3>
                  <p className="text-soft-gold text-xs sm:text-sm">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-luxury-gold font-bold text-sm sm:text-base">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-soft-gold text-xs">
                    {formatPrice(item.price)}/sp
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 border-t border-luxury-gold/20">
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-soft-gold">Tạm tính:</span>
                <span className="text-luxury-gold">
                  {formatPrice(orderData.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft-gold">Phí vận chuyển:</span>
                <span className="text-luxury-gold">
                  {formatPrice(orderData.shipping_fee)}
                </span>
              </div>
              <div className="flex justify-between text-lg sm:text-xl font-bold pt-2 border-t border-luxury-gold/20">
                <span className="text-luxury-gold">Tổng cộng:</span>
                <span className="text-luxury-gold">
                  {formatPrice(orderData.total_amount || orderData.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-luxury-gold mb-4 flex items-center gap-2">
            <span>⏭️</span>
            Bước Tiếp Theo
          </h2>
          
          <div className="space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-3">
              <span className="text-luxury-gold text-lg">1️⃣</span>
              <p className="text-soft-gold">
                Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận đơn hàng
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-luxury-gold text-lg">2️⃣</span>
              <p className="text-soft-gold">
                Thời gian giao hàng: 2-3 ngày làm việc tại TP.HCM và các tỉnh lân cận
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-luxury-gold text-lg">3️⃣</span>
              <p className="text-soft-gold">
                {orderData.payment_method === 'cod' 
                  ? 'Thanh toán khi nhận hàng (COD)' 
                  : 'Vui lòng chuyển khoản theo thông tin đã cung cấp'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
          >
            Tiếp Tục Mua Sắm
          </button>
          <button
            onClick={() => navigate('/')}
            className="border border-luxury-gold/50 text-luxury-gold px-6 py-3 rounded-lg font-bold hover:bg-luxury-gold/10 transition-all duration-300 text-sm sm:text-base"
          >
            Về Trang Chủ
          </button>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-soft-gold">
          <p className="mb-1">Cần hỗ trợ? Liên hệ với chúng tôi:</p>
          <p>
            📞 <span className="text-luxury-gold">0123 456 789</span> | 
            📧 <span className="text-luxury-gold">support@tramhuong.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;