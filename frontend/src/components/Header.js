import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import IconWrapper from './IconWrapper';

const Header = () => {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep-black/90 backdrop-blur-md border-b border-luxury-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center shadow-lg">
              <IonIcon icon="sparkles" size={20} color="#1a1a1a" />
            </div>
            <div className="text-luxury-gold font-luxury text-xl font-bold">
              Khang Trầm Hương
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              // Skip account item if not authenticated and show login status
              if (item.path === '/account' && !isAuthenticated) {
                return null;
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'text-luxury-gold'
                      : 'text-white hover:text-luxury-gold'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <IonIcon icon={item.icon} size={18} />
                    <span>
                      {item.path === '/account' && isAuthenticated 
                        ? (user?.full_name || 'Tài Khoản')
                        : item.label
                      }
                    </span>
                  </span>
                  {item.path === '/cart' && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-luxury-gold text-deep-black text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                  {location.pathname === item.path && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold rounded-full"></div>
                  )}
                </Link>
              );
            })}
            
            {/* Login/Account button */}
            {!isAuthenticated && (
              <Link
                to="/account"
                className={`relative px-4 py-2 transition-all duration-300 ${
                  location.pathname === '/account'
                    ? 'text-luxury-gold'
                    : 'text-white hover:text-luxury-gold'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <IonIcon icon="log-in-outline" size={18} />
                  <span>Đăng Nhập</span>
                </span>
                {location.pathname === '/account' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold rounded-full"></div>
                )}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;