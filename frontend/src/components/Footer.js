import React from 'react';
import { Link } from 'react-router-dom';
import IonIcon from './IonIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-black border-t border-luxury-gold/20 mt-2 sm:mt-4 pb-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Company Info */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
              <IonIcon icon="sparkles" size={16} color="#1a1a1a" />
            </div>
            <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
              Khang Trầm Hương
            </h3>
          </div>
          <p className="text-soft-gold text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-md">
            Chuyên cung cấp trầm hương cao cấp, chất lượng luxury với hơn 20 năm kinh nghiệm trong ngành.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="flex items-center space-x-1 text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
              <IonIcon icon="logo-facebook" size={16} />
              <span>Facebook</span>
            </a>
            <a href="https://instagram.com" className="flex items-center space-x-1 text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
              <IonIcon icon="logo-instagram" size={16} />
              <span>Instagram</span>
            </a>
            <a href="https://zalo.me" className="flex items-center space-x-1 text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
              <IonIcon icon="chatbubble" size={16} />
              <span>Zalo</span>
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
                <Link to="/" className="flex items-center space-x-2 text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
                  <IonIcon icon="information-circle" size={14} />
                  <span>Về Chúng Tôi</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="flex items-center space-x-2 text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
                  <IonIcon icon="storefront" size={14} />
                  <span>Sản Phẩm</span>
                </Link>
              </li>
              <li>
                <Link to="/news" className="flex items-center space-x-2 text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
                  <IonIcon icon="newspaper" size={14} />
                  <span>Tin Tức</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center space-x-2 text-soft-gold hover:text-luxury-gold transition-colors text-xs sm:text-sm">
                  <IonIcon icon="call" size={14} />
                  <span>Liên Hệ</span>
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
              <div className="flex items-center space-x-2">
                <IonIcon icon="call" size={14} />
                <a href="tel:0123456789" className="hover:text-luxury-gold transition-colors">
                  0123 456 789
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <IonIcon icon="mail" size={14} />
                <a href="mailto:info@khangtramhuong.com" className="hover:text-luxury-gold transition-colors">
                  info@khangtramhuong.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <IonIcon icon="location" size={14} className="mt-0.5" />
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