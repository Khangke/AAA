import React from 'react';

const CartPage = () => {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="font-luxury text-3xl md:text-4xl font-bold text-luxury-gold mb-4">
            Giỏ Hàng
          </h1>
          <p className="text-soft-gold text-lg max-w-2xl mx-auto">
            Xem lại các sản phẩm bạn đã chọn
          </p>
        </div>

        <div className="text-center py-20">
          <div className="text-luxury-gold text-6xl mb-6">🛒</div>
          <h2 className="font-luxury text-2xl text-luxury-gold mb-4">
            Giỏ Hàng Trống
          </h2>
          <p className="text-soft-gold mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <button className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105">
            Khám Phá Sản Phẩm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;