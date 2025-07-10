import React, { useState, useEffect } from 'react';
import cachedAPI from '../services/api';
import IonIcon from '../components/IonIcon';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        
        {/* Hero Section - Enhanced with Full Background Image */}
        <div className={`relative mb-4 sm:mb-6 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Hero Background Image */}
          <div className="relative h-96 sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://cdn.myportfolio.com/b60af86a855ed2da587d6e31dbd728bf/584cc299-eacc-457d-93d7-684d4af9a6e5.jpg?h=8730de8918cada72cfaf3ccccf1ff0f5"
              alt="Luxury Incense Hero"
              className="w-full h-full object-cover"
            />
            
            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center px-4 sm:px-6 max-w-5xl mx-auto">
                {/* Logo and Brand */}
                <div className="mb-6 sm:mb-8">
                  <h1 className="font-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-luxury-gold mb-4 drop-shadow-2xl" style={{textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)'}}>
                    Khang Trầm Hương
                  </h1>
                </div>

                {/* Main Content */}
                <div className="p-6 sm:p-8 md:p-12">
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-luxury font-bold text-luxury-gold mb-4 sm:mb-6 drop-shadow-2xl" style={{textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), 1px 1px 3px rgba(0, 0, 0, 0.6)'}}>
                    Tinh Hoa Trầm Hương Việt Nam
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 leading-relaxed drop-shadow-xl font-medium" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), 1px 1px 2px rgba(0, 0, 0, 0.7)'}}>
                    Chất Lượng Luxury • 20+ Năm Kinh Nghiệm • Hàng Ngàn Khách Hàng Tin Tưởng
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center max-w-lg mx-auto">
                    <button 
                      className="btn-luxury bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 sm:px-5 sm:py-2 rounded-full font-bold text-xs sm:text-sm hover:shadow-xl transition-all duration-500 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
                      onClick={() => window.location.href = '/products'}
                    >
                      <IonIcon icon="storefront-outline" size={14} color="#1a1a1a" />
                      <span>Khám Phá Sản Phẩm</span>
                    </button>
                    <button 
                      className="btn-luxury border-2 border-luxury-gold text-luxury-gold px-4 py-2 sm:px-5 sm:py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-luxury-gold hover:text-deep-black transition-all duration-500 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
                      onClick={() => window.location.href = '/contact'}
                    >
                      <IonIcon icon="call-outline" size={14} />
                      <span>Liên Hệ Ngay</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Corner Decorations */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-luxury-gold/60 animate-float rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-luxury-gold/60 animate-float-reverse rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-luxury-gold/60 animate-float-reverse rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-luxury-gold/60 animate-float rounded-br-lg"></div>
          </div>
        </div>

        {/* Products Section - Enhanced with More Animations */}
        <div className="mb-4 sm:mb-6">
          <div className="text-center mb-2 sm:mb-4">
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
                /* Mobile: Ultra Enhanced Horizontal Scroll */
                <div>
                  <div className="flex gap-6 overflow-x-auto pb-6 px-4 -mx-4 scrollbar-luxury product-scroll">
                    {featuredProducts.map((product, index) => (
                      <div 
                        key={product.id} 
                        className="group relative card-luxury glass-morphism rounded-3xl overflow-hidden border border-luxury-gold/50 hover:border-luxury-gold transition-all duration-700 cursor-pointer flex-shrink-0 w-72 min-w-72 hover:shadow-2xl hover:shadow-luxury-gold/40"
                        style={{
                          animationDelay: `${index * 200}ms`,
                          animation: isLoaded ? 'slideInRight 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none'
                        }}
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-2"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1662473217799-6e7288f19741';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                        
                        <div className="p-5 glass-morphism-light backdrop-blur-ultra">
                          <h3 className="font-luxury text-sm font-bold text-luxury-gold mb-3 line-clamp-2 leading-tight group-hover:text-glow transition-all duration-500">
                            {product.name}
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-luxury-gold font-bold text-lg text-glow">
                                {formatPrice(product.price)}
                              </span>
                              <div className="flex text-luxury-gold text-sm animate-float">
                                {'⭐'.repeat(5)}
                              </div>
                            </div>
                            <button 
                              className="w-full btn-luxury bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-3 rounded-2xl font-bold text-sm hover:shadow-xl transition-all duration-700 flex items-center justify-center space-x-2 transform hover:scale-105 ultra-smooth-hover"
                              onClick={() => window.location.href = `/products/${product.id}`}
                            >
                              <IonIcon icon="eye-outline" size={16} color="#1a1a1a" className="animate-float" />
                              <span>Xem Chi Tiết</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-soft-gold text-sm opacity-70 animate-pulse text-glow">← Lướt để khám phá thêm →</p>
                  </div>
                </div>
              ) : (
                /* Desktop: Ultra Enhanced Grid Layout */
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="group relative card-luxury glass-morphism rounded-3xl overflow-hidden border border-luxury-gold/50 hover:border-luxury-gold transition-all duration-700 cursor-pointer hover:shadow-2xl hover:shadow-luxury-gold/40"
                      style={{
                        animationDelay: `${index * 200}ms`,
                        animation: isLoaded ? 'slideInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none'
                      }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-2"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1662473217799-6e7288f19741';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                      
                      <div className="p-6 glass-morphism-light backdrop-blur-ultra">
                        <h3 className="font-luxury text-lg font-bold text-luxury-gold mb-4 line-clamp-2 group-hover:text-glow transition-all duration-500">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col space-y-2">
                            <span className="text-luxury-gold font-bold text-xl text-glow">
                              {formatPrice(product.price)}
                            </span>
                            <div className="flex text-luxury-gold text-sm animate-float">
                              {'⭐'.repeat(5)}
                            </div>
                          </div>
                          <button 
                            className="btn-luxury bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-xl transition-all duration-700 flex items-center space-x-2 transform hover:scale-105 ultra-smooth-hover"
                            onClick={() => window.location.href = `/products/${product.id}`}
                          >
                            <IonIcon icon="eye-outline" size={16} color="#1a1a1a" className="animate-float" />
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl">{feature.icon}</span>
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

        {/* CTA Section - Enhanced with Particle Effects */}
        <div className="relative bg-gradient-to-r from-luxury-gold/15 to-luxury-copper/15 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-luxury-gold/50 text-center overflow-hidden">
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