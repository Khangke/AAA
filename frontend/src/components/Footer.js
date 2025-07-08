import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { path: '/', label: 'Trang Chủ' },
    { path: '/products', label: 'Sản Phẩm' },
    { path: '/about', label: 'Giới Thiệu' },
    { path: '/news', label: 'Tin Tức' },
    { path: '/contact', label: 'Liên Hệ' }
  ];

  const productCategories = [
    'Trầm Bột',
    'Nhang Trầm',
    'Vòng Tay',
    'Trầm Khối',
    'Bộ Sưu Tập'
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-black border-t border-luxury-gold/20 mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
                <span className="text-deep-black font-bold text-sm">K</span>
              </div>
              <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
                Khang Trầm Hương
              </h3>
            </div>
            <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
              20 năm kinh nghiệm trong lĩnh vực trầm hương cao cấp. 
              Chúng tôi cam kết mang đến những sản phẩm chất lượng nhất từ thiên nhiên.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center hover:bg-luxury-gold/40 transition-colors">
                <span className="text-luxury-gold text-sm">📘</span>
              </a>
              <a href="#" className="w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center hover:bg-luxury-gold/40 transition-colors">
                <span className="text-luxury-gold text-sm">📱</span>
              </a>
              <a href="#" className="w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center hover:bg-luxury-gold/40 transition-colors">
                <span className="text-luxury-gold text-sm">📧</span>
              </a>
              <a href="#" className="w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center hover:bg-luxury-gold/40 transition-colors">
                <span className="text-luxury-gold text-sm">📞</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-soft-gold text-xs sm:text-sm hover:text-luxury-gold transition-colors flex items-center"
                  >
                    <span className="mr-2">▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold">
              Sản Phẩm
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              {productCategories.map((category) => (
                <li key={category}>
                  <a 
                    href="#"
                    className="text-soft-gold text-xs sm:text-sm hover:text-luxury-gold transition-colors flex items-center"
                  >
                    <span className="mr-2">🌿</span>
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold">
              Liên Hệ
            </h4>
            <div className="space-y-2 text-soft-gold text-xs sm:text-sm">
              <div className="flex items-start">
                <span className="mr-2 mt-0.5">📍</span>
                <span>123 Đường Trầm Hương<br/>Nha Trang, Khánh Hòa</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <a href="tel:0123456789" className="hover:text-luxury-gold transition-colors">
                  0123 456 789
                </a>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✉️</span>
                <a href="mailto:info@khangtramhuong.com" className="hover:text-luxury-gold transition-colors">
                  info@khangtramhuong.com
                </a>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⏰</span>
                <span>8:00 - 20:00 (T2-CN)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-luxury-gold/20">
          <div className="text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div className="mb-3 sm:mb-0">
              <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-1">
                📬 Đăng Ký Nhận Tin
              </h4>
              <p className="text-soft-gold text-xs sm:text-sm">
                Nhận thông tin ưu đãi và sản phẩm mới nhất
              </p>
            </div>
            <div className="flex gap-2 max-w-xs mx-auto sm:mx-0">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-2 py-1 sm:px-3 sm:py-2 bg-deep-black/50 border border-luxury-gold/20 rounded-full text-white placeholder-soft-gold focus:outline-none focus:border-luxury-gold/60 text-xs sm:text-sm"
              />
              <button className="bg-luxury-gold text-deep-black px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold hover:bg-luxury-copper transition-colors text-xs sm:text-sm">
                Đăng Ký
              </button>
            </div>
          </div>
        </div>

        {/* Payment & Shipping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-luxury-gold/5 to-transparent p-3 rounded-lg">
            <h5 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-2">
              💳 Phương Thức Thanh Toán
            </h5>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded">💵 Tiền mặt</span>
              <span className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded">💳 Thẻ</span>
              <span className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded">📱 Chuyển khoản</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-luxury-gold/5 to-transparent p-3 rounded-lg">
            <h5 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-2">
              🚚 Vận Chuyển
            </h5>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded">🏃 Nhanh</span>
              <span className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded">📦 An toàn</span>
              <span className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded">🆓 Miễn phí</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-luxury-gold/20 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-soft-gold text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Khang Trầm Hương. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors">
                Chính sách bảo mật
              </a>
              <span className="text-soft-gold/50">|</span>
              <a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors">
                Điều khoản sử dụng
              </a>
              <span className="text-soft-gold/50">|</span>
              <a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors">
                Hỗ trợ
              </a>
            </div>
          </div>
        </div>

        {/* Certificate Badges */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-luxury-gold/10 px-2 py-1 rounded border border-luxury-gold/20">
            <span className="text-luxury-gold text-3xs sm:text-2xs font-bold">🏆 ISO 9001:2015</span>
          </div>
          <div className="bg-luxury-gold/10 px-2 py-1 rounded border border-luxury-gold/20">
            <span className="text-luxury-gold text-3xs sm:text-2xs font-bold">🌿 100% Organic</span>
          </div>
          <div className="bg-luxury-gold/10 px-2 py-1 rounded border border-luxury-gold/20">
            <span className="text-luxury-gold text-3xs sm:text-2xs font-bold">⭐ 5 Sao Châu Á</span>
          </div>
          <div className="bg-luxury-gold/10 px-2 py-1 rounded border border-luxury-gold/20">
            <span className="text-luxury-gold text-3xs sm:text-2xs font-bold">✅ Chứng nhận xuất khẩu</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;