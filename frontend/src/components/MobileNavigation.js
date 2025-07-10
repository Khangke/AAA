import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import IonIcon from './IonIcon';

const MobileNavigation = () => {
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  // Safely get cart count with error handling
  let cartCount = 0;
  try {
    cartCount = getCartItemCount() || 0;
  } catch (error) {
    console.error('Error getting cart count:', error);
    cartCount = 0;
  }

  const navItems = [
    { path: '/', label: 'Trang Chủ', icon: 'home-outline' },
    { path: '/products', label: 'Sản Phẩm', icon: 'storefront-outline' },
    { path: '/about', label: 'Giới Thiệu', icon: 'information-circle-outline' },
    { path: '/news', label: 'Tin Tức', icon: 'newspaper-outline' },
    { path: '/contact', label: 'Liên Hệ', icon: 'call-outline' },
    { path: '/cart', label: 'Giỏ Hàng', icon: 'bag-outline' },
    { path: '/account', label: 'Tài Khoản', icon: 'person-outline' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-deep-black/95 backdrop-blur-md border-t border-luxury-gold/20 safe-area-inset-bottom">
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
              <IonIcon icon={item.icon} size={20} />
              {item.path === '/cart' && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-deep-black text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 text-center leading-none">
              {item.path === '/account' 
                ? (isAuthenticated ? (user?.full_name?.split(' ')[0] || 'Tài Khoản') : 'Đăng Nhập')
                : item.label
              }
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