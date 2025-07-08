import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-black border-t border-luxury-gold/20 mt-8 sm:mt-12 mb-20 sm:mb-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Company Info */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
              <span className="text-deep-black font-bold text-sm">K</span>
            </div>
            <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
              Khang Trầm Hương
            </h3>
          </div>
          <p className="text-soft-gold text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-md">
            Chuyên cung cấp trầm hương cao cấp, chất lượng luxury với hơn 20 năm kinh nghiệm trong ngành.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
              Facebook
            </a>
            <a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
              Instagram
            </a>
            <a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
              Zalo
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          
          {/* Links */}
          <div>
            <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-3 sm:mb-4">
              Liên kết
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
                  Tin Tức
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-3 sm:mb-4">
              Liên Hệ
            </h4>
            <div className="space-y-2 text-soft-gold text-xs sm:text-sm">
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
              <div className="flex items-start">
                <span className="mr-2 mt-0.5">📍</span>
                <span>123 Đường ABC, Quận 1, TP HCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-luxury-gold/20 pt-4 sm:pt-6 text-center">
          <p className="text-soft-gold text-xs sm:text-sm">
            © {currentYear} Khang Trầm Hương. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;