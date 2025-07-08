import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNavigation = ({ cartCount }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Trang Chủ', icon: '🏠' },
    { path: '/products', label: 'Sản Phẩm', icon: '🛍️' },
    { path: '/about', label: 'Giới Thiệu', icon: 'ℹ️' },
    { path: '/news', label: 'Tin Tức', icon: '📰' },
    { path: '/contact', label: 'Liên Hệ', icon: '📞' },
    { path: '/cart', label: 'Giỏ Hàng', icon: '🛒' },
    { path: '/account', label: 'Tài Khoản', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-deep-black/95 backdrop-blur-md border-t border-luxury-gold/20">
      <div className="grid grid-cols-7 gap-1 px-2 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-300 ${
              location.pathname === item.path
                ? 'bg-luxury-gold/20 text-luxury-gold'
                : 'text-white/70 hover:text-luxury-gold hover:bg-luxury-gold/10'
            }`}
          >
            <div className="relative">
              <span className="text-lg">{item.icon}</span>
              {item.path === '/cart' && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-deep-black text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 text-center leading-none">
              {item.label}
            </span>
            {location.pathname === item.path && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-luxury-gold rounded-full animate-glow"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;