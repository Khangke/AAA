import React, { useState, useEffect } from 'react';
import cachedAPI from '../services/api';
import IonIcon from '../components/IonIcon';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const bannerImages = [
    'https://images.unsplash.com/photo-1541795083-1b160cf4f3d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxpbmNlbnNlfGVufDB8fHxibGFja3wxNzUyMTE5OTQ5fDA&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1628709353367-35f0bb07413d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxpbmNlbnNlfGVufDB8fHxibGFja3wxNzUyMTE5OTQ5fDA&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1611072488315-fd8d5f8bc1e3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxhZ2Fyd29vZHxlbnwwfHx8YmxhY2t8MTc1MjExOTk1Nnww&ixlib=rb-4.1.0&q=85'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Banner auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const fetchFeaturedProducts = async () => {
    try {
      const products = await cachedAPI.getAllProducts();
      
      // Filter featured products or take first 6
      const featured = products.filter(p => p.featured) || products.slice(0, 6);
      setFeaturedProducts(featured);
      
      console.log('Featured products loaded:', featured.length);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      
      // Fallback to static data if API fails
      const fallbackProducts = [
        {
          id: 1,
          name: 'Vòng Trầm Hương Cao Cấp',
          price: 2500000,
          image_url: 'https://images.unsplash.com/photo-1662473217799-6e7288f19741',
        },
        {
          id: 2,
          name: 'Trầm Hương Nguyên Khối',
          price: 5800000,
          image_url: 'https://images.unsplash.com/photo-1719611639294-f754d39a6bed',
        },
        {
          id: 3,
          name: 'Nhang Trầm Hương Premium',
          price: 850000,
          image_url: 'https://images.unsplash.com/photo-1652959889888-53d048374e35',
        },
        {
          id: 4,
          name: 'Tràng Hạt Trầm Hương',
          price: 1200000,
          image_url: 'https://images.unsplash.com/photo-1662473217799-6e7288f19741',
        },
        {
          id: 5,
          name: 'Tinh Dầu Trầm Hương',
          price: 980000,
          image_url: 'https://images.unsplash.com/photo-1719611639294-f754d39a6bed',
        },
        {
          id: 6,
          name: 'Gỗ Trầm Hương Tự Nhiên',
          price: 3500000,
          image_url: 'https://images.unsplash.com/photo-1652959889888-53d048374e35',
        }
      ];
      
      setFeaturedProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-deep-black to-charcoal mobile-nav-padding">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Hero Section - Enhanced with Banner */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Logo and Brand */}
          <div className="mb-6 sm:mb-8">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full animate-pulse opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-deep-black font-bold text-2xl sm:text-3xl">K</span>
              </div>
            </div>
            <h1 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-luxury-gold via-warm-gold to-luxury-copper bg-clip-text text-transparent drop-shadow-lg">
              Khang Trầm Hương
            </h1>
          </div>

          {/* Banner Section */}
          <div className="relative mb-6 sm:mb-8">
            <div className="relative h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
              {bannerImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentBanner ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
              ))}
              
              {/* Banner Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 sm:px-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-luxury font-bold text-luxury-gold mb-2 sm:mb-4 drop-shadow-lg">
                    Tinh Hoa Trầm Hương Việt Nam
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-soft-gold mb-4 sm:mb-6 drop-shadow-lg">
                    Chất Lượng Luxury • 20+ Năm Kinh Nghiệm • Hàng Ngàn Khách Hàng Tin Tưởng
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button 
                      className="group relative overflow-hidden bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                      onClick={() => window.location.href = '/products'}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-copper to-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <IonIcon icon="storefront-outline" size={18} color="#1a1a1a" />
                      <span className="relative z-10">Khám Phá Sản Phẩm</span>
                    </button>
                    <button 
                      className="group relative overflow-hidden border-2 border-luxury-gold text-luxury-gold px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-luxury-gold hover:text-deep-black transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                      onClick={() => window.location.href = '/contact'}
                    >
                      <IonIcon icon="call-outline" size={18} className="group-hover:animate-pulse" />
                      <span>Liên Hệ Ngay</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Banner Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentBanner
                        ? 'bg-luxury-gold w-8'
                        : 'bg-luxury-gold/50 hover:bg-luxury-gold/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section - Enhanced with More Animations */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-3 sm:mb-6">
            <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-2">
              <span className="inline-block animate-bounce">🌟</span> Sản Phẩm Nổi Bật
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-luxury-gold to-luxury-copper mx-auto rounded-full"></div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent shadow-lg"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-luxury-gold opacity-30"></div>
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              {isMobile ? (
                /* Mobile: Enhanced Horizontal Scroll */
                <div>
                  <div className="flex gap-4 overflow-x-auto pb-6 px-4 -mx-4 scrollbar-hide product-scroll">
                    {featuredProducts.map((product, index) => (
                      <div 
                        key={product.id} 
                        className="group relative bg-black/90 backdrop-blur-md rounded-2xl overflow-hidden border border-luxury-gold/40 hover:border-luxury-gold/80 transition-all duration-700 cursor-pointer flex-shrink-0 w-64 min-w-64 hover:shadow-2xl hover:shadow-luxury-gold/30 transform hover:scale-105"
                        style={{
                          animationDelay: `${index * 150}ms`,
                          animation: isLoaded ? 'slideInRight 0.8s ease-out forwards' : 'none'
                        }}
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1662473217799-6e7288f19741';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Floating Elements */}
                          <div className="absolute top-3 right-3 bg-luxury-gold/95 backdrop-blur-sm text-deep-black px-2 py-1 rounded-full text-xs font-bold transform translate-y-[-30px] group-hover:translate-y-0 transition-all duration-500">
                            HOT
                          </div>
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-luxury-gold px-2 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-x-[-30px] group-hover:translate-x-0 transition-all duration-500 delay-100">
                            ⚡ SALE
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-b from-transparent to-black/40 backdrop-blur-sm">
                          <h3 className="font-luxury text-sm font-bold text-luxury-gold mb-3 line-clamp-2 leading-tight group-hover:text-luxury-copper transition-colors duration-500">
                            {product.name}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-luxury-gold font-bold text-base">
                                {formatPrice(product.price)}
                              </span>
                              <div className="flex text-luxury-gold text-xs">
                                {'⭐'.repeat(5)}
                              </div>
                            </div>
                            <button 
                              className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-3 py-3 rounded-xl font-bold text-sm hover:shadow-xl transition-all duration-500 flex items-center justify-center space-x-2 transform hover:scale-105 group-hover:shadow-luxury-gold/50"
                              onClick={() => window.location.href = `/products/${product.id}`}
                            >
                              <IonIcon icon="eye-outline" size={16} color="#1a1a1a" />
                              <span>Xem Chi Tiết</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-soft-gold text-xs opacity-70 animate-pulse">← Lướt để xem thêm →</p>
                  </div>
                </div>
              ) : (
                /* Desktop: Enhanced Grid Layout */
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="group relative bg-black/90 backdrop-blur-md rounded-2xl overflow-hidden border border-luxury-gold/40 hover:border-luxury-gold/80 transition-all duration-700 cursor-pointer hover:shadow-2xl hover:shadow-luxury-gold/30 transform hover:scale-105"
                      style={{
                        animationDelay: `${index * 150}ms`,
                        animation: isLoaded ? 'slideInUp 0.8s ease-out forwards' : 'none'
                      }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1662473217799-6e7288f19741';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Floating Elements */}
                        <div className="absolute top-3 right-3 bg-luxury-gold/95 backdrop-blur-sm text-deep-black px-3 py-1 rounded-full text-xs font-bold transform translate-y-[-30px] group-hover:translate-y-0 transition-all duration-500">
                          HOT
                        </div>
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-luxury-gold px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-x-[-30px] group-hover:translate-x-0 transition-all duration-500 delay-100">
                          ⚡ SALE
                        </div>
                        
                        {/* Heart Icon */}
                        <div className="absolute top-3 right-16 bg-black/60 backdrop-blur-sm text-luxury-gold p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-[-30px] group-hover:translate-y-0 transition-all duration-500 delay-200 hover:bg-luxury-gold hover:text-deep-black cursor-pointer">
                          <IonIcon icon="heart-outline" size={16} />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-b from-transparent to-black/40 backdrop-blur-sm">
                        <h3 className="font-luxury text-base font-bold text-luxury-gold mb-3 line-clamp-2 group-hover:text-luxury-copper transition-colors duration-500">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-luxury-gold font-bold text-base">
                              {formatPrice(product.price)}
                            </span>
                            <div className="flex text-luxury-gold text-xs mt-1">
                              {'⭐'.repeat(5)}
                            </div>
                          </div>
                          <button 
                            className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 rounded-full font-bold text-sm hover:shadow-xl transition-all duration-500 flex items-center space-x-1 transform hover:scale-105 group-hover:shadow-luxury-gold/50"
                            onClick={() => window.location.href = `/products/${product.id}`}
                          >
                            <IonIcon icon="eye-outline" size={14} color="#1a1a1a" />
                            <span>Xem</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* No Products Found - Enhanced */
            <div className="text-center py-12">
              <div className="text-luxury-gold text-6xl mb-6 animate-bounce">📦</div>
              <p className="text-soft-gold text-lg mb-6">Chưa có sản phẩm nào</p>
              <button 
                className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-500 flex items-center space-x-2 transform hover:scale-105 mx-auto"
                onClick={() => window.location.reload()}
              >
                <IonIcon icon="refresh-outline" size={18} color="#1a1a1a" />
                <span>Tải Lại</span>
              </button>
            </div>
          )}
          
          <div className="text-center mt-6 sm:mt-8">
            <button 
              className="group text-luxury-gold hover:text-luxury-copper transition-colors duration-500 text-sm sm:text-base underline flex items-center space-x-2 mx-auto"
              onClick={() => window.location.href = '/products'}
            >
              <span>Xem Tất Cả Sản Phẩm</span>
              <IonIcon icon="arrow-forward-outline" size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* Features Section - Enhanced with Floating Effects */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-3 sm:mb-6">
            <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-2">
              <span className="inline-block animate-pulse">✨</span> Tại Sao Chọn Chúng Tôi?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-luxury-gold to-luxury-copper mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: '🌿',
                title: '100% Tự Nhiên',
                description: 'Trầm hương nguyên chất, không pha tạp',
                delay: 0
              },
              {
                icon: '👑',
                title: 'Chất Lượng Luxury',
                description: 'Tiêu chuẩn cao cấp, kiểm tra nghiêm ngặt',
                delay: 200
              },
              {
                icon: '🏆',
                title: 'Uy Tín 20+ Năm',
                description: 'Hàng ngàn khách hàng tin tưởng',
                delay: 400
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative text-center p-4 sm:p-6 bg-black/80 backdrop-blur-md rounded-2xl border border-luxury-gold/40 hover:border-luxury-gold/80 transition-all duration-700 hover:shadow-xl hover:shadow-luxury-gold/30 transform hover:scale-105"
                style={{
                  animationDelay: `${feature.delay}ms`,
                  animation: isLoaded ? 'slideInUp 0.8s ease-out forwards' : 'none'
                }}
              >
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-luxury-gold/30 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 right-4 w-1 h-1 bg-luxury-gold/50 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-luxury-gold/40 rounded-full animate-pulse delay-500"></div>
                </div>
                
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full animate-pulse opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center shadow-xl transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700">
                    <span className="text-2xl sm:text-3xl">{feature.icon}</span>
                  </div>
                </div>
                
                <h3 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-3 group-hover:text-luxury-copper transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-soft-gold text-xs sm:text-sm leading-relaxed group-hover:text-white transition-colors duration-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section - Enhanced with Floating Animation */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-3 sm:mb-6">
            <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-2">
              <span className="inline-block animate-bounce">💬</span> Khách Hàng Nói Gì
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-luxury-gold to-luxury-copper mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: 'Anh Minh',
                location: 'TP.HCM',
                testimonial: 'Chất lượng tuyệt vời, hương thơm rất đậm đà và tự nhiên!',
                avatar: 'A',
                emoji: '👍'
              },
              {
                name: 'Chị Lan',
                location: 'Hà Nội',
                testimonial: 'Phục vụ tận tình, sản phẩm đúng như mô tả. Rất hài lòng!',
                avatar: 'L',
                emoji: '❤️'
              },
              {
                name: 'Anh Hưng',
                location: 'Đà Nẵng',
                testimonial: 'Chất lượng cao cấp, xứng đáng với giá tiền!',
                avatar: 'H',
                emoji: '🔥'
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group relative bg-black/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-luxury-gold/40 hover:border-luxury-gold/80 transition-all duration-700 hover:shadow-xl hover:shadow-luxury-gold/30 transform hover:scale-105"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: isLoaded ? 'slideInUp 0.8s ease-out forwards' : 'none'
                }}
              >
                {/* Floating quote marks */}
                <div className="absolute top-2 left-2 text-luxury-gold/30 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  "
                </div>
                <div className="absolute bottom-2 right-2 text-luxury-gold/30 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  "
                </div>
                
                <div className="flex items-center mb-4 sm:mb-5">
                  <div className="relative w-12 h-12 mr-3">
                    <div className="absolute inset-0 bg-luxury-gold rounded-full animate-pulse opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                    <div className="relative w-full h-full bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                      <span className="text-deep-black font-bold text-sm">{testimonial.avatar}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-gold text-sm group-hover:text-luxury-copper transition-colors duration-500">{testimonial.name}</h4>
                    <p className="text-soft-gold text-xs">{testimonial.location}</p>
                  </div>
                </div>
                
                <p className="text-soft-gold text-xs sm:text-sm italic leading-relaxed mb-3 group-hover:text-white transition-colors duration-500">
                  {testimonial.testimonial}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-luxury-gold text-sm">⭐⭐⭐⭐⭐</div>
                  <div className="w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center group-hover:bg-luxury-gold/40 transition-colors duration-500 transform group-hover:scale-110">
                    <span className="text-luxury-gold text-sm">{testimonial.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Enhanced with Particle Effects */}
        <div className="relative bg-gradient-to-r from-luxury-gold/15 to-luxury-copper/15 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-luxury-gold/50 text-center overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-2 h-2 bg-luxury-gold/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-10 right-10 w-1 h-1 bg-luxury-gold/50 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-luxury-gold/40 rounded-full animate-bounce"></div>
            <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-luxury-gold/20 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-luxury-gold/60 rounded-full animate-ping delay-500"></div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="mb-4 sm:mb-6">
              <div className="inline-block animate-bounce text-3xl sm:text-4xl mb-3">🎉</div>
              <h2 className="font-luxury text-lg sm:text-xl md:text-2xl font-bold text-luxury-gold mb-2">
                Sẵn Sàng Trải Nghiệm Trầm Hương Luxury?
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-luxury-gold to-luxury-copper mx-auto rounded-full mb-3"></div>
            </div>
            
            <p className="text-soft-gold text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed max-w-2xl mx-auto">
              Liên hệ ngay để được tư vấn sản phẩm phù hợp • Miễn phí giao hàng toàn quốc • Bảo hành chính hãng
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
              <button 
                className="group relative overflow-hidden bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:shadow-2xl transition-all duration-500 flex items-center justify-center space-x-2 transform hover:scale-105"
                onClick={() => window.location.href = '/contact'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-copper to-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <IonIcon icon="call-outline" size={20} color="#1a1a1a" className="group-hover:animate-pulse relative z-10" />
                <span className="relative z-10">Liên Hệ Ngay</span>
              </button>
              
              <button 
                className="group relative overflow-hidden border-2 border-luxury-gold text-luxury-gold px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-luxury-gold hover:text-deep-black transition-all duration-500 flex items-center justify-center space-x-2 transform hover:scale-105"
                onClick={() => window.location.href = '/products'}
              >
                <IonIcon icon="storefront-outline" size={20} className="group-hover:animate-pulse" />
                <span>Khám Phá Ngay</span>
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex justify-center items-center space-x-6 mt-6 sm:mt-8 text-soft-gold text-xs sm:text-sm">
              <div className="flex items-center space-x-1">
                <span>🚚</span>
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🔒</span>
                <span>Thanh toán an toàn</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>⭐</span>
                <span>Đánh giá 5 sao</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;