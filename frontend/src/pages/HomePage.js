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
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's sm breakpoint
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Hero Section - Enhanced */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="mb-4 sm:mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 group">
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full animate-pulse opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-deep-black font-bold text-2xl sm:text-3xl">K</span>
              </div>
            </div>
            <h1 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-luxury-gold via-warm-gold to-luxury-copper bg-clip-text text-transparent drop-shadow-lg">
              Khang Trầm Hương
            </h1>
          </div>
          
          <p className="text-soft-gold text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            Tinh Hoa Trầm Hương Việt Nam • Chất Lượng Luxury • 20+ Năm Kinh Nghiệm
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center max-w-md mx-auto">
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

        {/* Products Section - Enhanced */}
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
                  <div className="flex gap-4 overflow-x-auto pb-4 px-4 -mx-4 scrollbar-hide product-scroll">
                    {featuredProducts.map((product, index) => (
                      <div 
                        key={product.id} 
                        className="group bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-luxury-gold/30 hover:border-luxury-gold/60 transition-all duration-500 cursor-pointer flex-shrink-0 w-64 min-w-64 hover:shadow-2xl hover:shadow-luxury-gold/20 transform hover:scale-105"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: isLoaded ? 'slideInRight 0.6s ease-out forwards' : 'none'
                        }}
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1662473217799-6e7288f19741';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-2 right-2 bg-luxury-gold/90 backdrop-blur-sm text-deep-black px-2 py-1 rounded-full text-xs font-bold transform translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-300">
                            HOT
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
                          <h3 className="font-luxury text-sm font-bold text-luxury-gold mb-3 line-clamp-2 leading-tight group-hover:text-luxury-copper transition-colors duration-300">
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
                              className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-3 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
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
                  <div className="text-center mt-4">
                    <p className="text-soft-gold text-xs opacity-70 animate-pulse">← Lướt để xem thêm →</p>
                  </div>
                </div>
              ) : (
                /* Desktop: Enhanced Grid Layout */
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="group bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-luxury-gold/30 hover:border-luxury-gold/60 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-luxury-gold/20 transform hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isLoaded ? 'slideInUp 0.6s ease-out forwards' : 'none'
                      }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1662473217799-6e7288f19741';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-luxury-gold/90 backdrop-blur-sm text-deep-black px-2 py-1 rounded-full text-xs font-bold transform translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-300">
                          HOT
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
                        <h3 className="font-luxury text-base font-bold text-luxury-gold mb-3 line-clamp-2 group-hover:text-luxury-copper transition-colors duration-300">
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
                            className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-all duration-300 flex items-center space-x-1 transform hover:scale-105"
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
              <div className="text-luxury-gold text-6xl mb-4 animate-bounce">📦</div>
              <p className="text-soft-gold text-lg mb-4">Chưa có sản phẩm nào</p>
              <button 
                className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 mx-auto"
                onClick={() => window.location.reload()}
              >
                <IonIcon icon="refresh-outline" size={18} color="#1a1a1a" />
                <span>Tải Lại</span>
              </button>
            </div>
          )}
          
          <div className="text-center mt-4 sm:mt-6">
            <button 
              className="group text-luxury-gold hover:text-luxury-copper transition-colors duration-300 text-sm sm:text-base underline flex items-center space-x-2 mx-auto"
              onClick={() => window.location.href = '/products'}
            >
              <span>Xem Tất Cả Sản Phẩm</span>
              <IonIcon icon="arrow-forward-outline" size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Features Section - Compact */}
        <div className="mb-8 sm:mb-12">
          <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-3 sm:mb-6 text-center">
            ✨ Tại Sao Chọn Chúng Tôi?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="text-center p-3 sm:p-6 bg-deep-black/50 rounded-xl border border-luxury-gold/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl">🌿</span>
              </div>
              <h3 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-1 sm:mb-2">
                100% Tự Nhiên
              </h3>
              <p className="text-soft-gold text-xs sm:text-sm">
                Trầm hương nguyên chất, không pha tạp
              </p>
            </div>
            
            <div className="text-center p-3 sm:p-6 bg-deep-black/50 rounded-xl border border-luxury-gold/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl">👑</span>
              </div>
              <h3 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-1 sm:mb-2">
                Chất Lượng Luxury
              </h3>
              <p className="text-soft-gold text-xs sm:text-sm">
                Tiêu chuẩn cao cấp, kiểm tra nghiêm ngặt
              </p>
            </div>
            
            <div className="text-center p-3 sm:p-6 bg-deep-black/50 rounded-xl border border-luxury-gold/20 sm:col-span-1 col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl">🏆</span>
              </div>
              <h3 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-1 sm:mb-2">
                Uy Tín 20+ Năm
              </h3>
              <p className="text-soft-gold text-xs sm:text-sm">
                Hàng ngàn khách hàng tin tưởng
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section - Compact */}
        <div className="mb-8 sm:mb-12">
          <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-3 sm:mb-6 text-center">
            💬 Khách Hàng Nói Gì
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-deep-black/50 p-3 sm:p-4 rounded-xl border border-luxury-gold/20">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center mr-2">
                  <span className="text-deep-black font-bold text-sm">A</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold text-xs sm:text-sm">Anh Minh</h4>
                  <p className="text-soft-gold text-3xs sm:text-xs">TP.HCM</p>
                </div>
              </div>
              <p className="text-soft-gold text-xs sm:text-sm italic">
                "Chất lượng tuyệt vời, hương thơm rất đậm đà và tự nhiên!"
              </p>
              <div className="text-luxury-gold text-xs mt-1">⭐⭐⭐⭐⭐</div>
            </div>
            
            <div className="bg-deep-black/50 p-3 sm:p-4 rounded-xl border border-luxury-gold/20">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center mr-2">
                  <span className="text-deep-black font-bold text-sm">L</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold text-xs sm:text-sm">Chị Lan</h4>
                  <p className="text-soft-gold text-3xs sm:text-xs">Hà Nội</p>
                </div>
              </div>
              <p className="text-soft-gold text-xs sm:text-sm italic">
                "Phục vụ tận tình, sản phẩm đúng như mô tả. Rất hài lòng!"
              </p>
              <div className="text-luxury-gold text-xs mt-1">⭐⭐⭐⭐⭐</div>
            </div>
            
            <div className="bg-deep-black/50 p-3 sm:p-4 rounded-xl border border-luxury-gold/20 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center mr-2">
                  <span className="text-deep-black font-bold text-sm">H</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold text-xs sm:text-sm">Anh Hưng</h4>
                  <p className="text-soft-gold text-3xs sm:text-xs">Đà Nẵng</p>
                </div>
              </div>
              <p className="text-soft-gold text-xs sm:text-sm italic">
                "Chất lượng cao cấp, xứng đáng với giá tiền!"
              </p>
              <div className="text-luxury-gold text-xs mt-1">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>

        {/* CTA Section - Compact */}
        <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 p-4 sm:p-6 rounded-xl border border-luxury-gold/20 text-center">
          <h2 className="font-luxury text-base sm:text-xl md:text-2xl font-bold text-luxury-gold mb-2 sm:mb-3">
            Sẵn Sàng Trải Nghiệm?
          </h2>
          <p className="text-soft-gold text-xs sm:text-sm mb-3 sm:mb-4">
            Liên hệ ngay để được tư vấn sản phẩm phù hợp
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center max-w-md mx-auto">
            <button className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-lg transition-all flex items-center justify-center space-x-2">
              <IonIcon icon="call-outline" size={18} color="#1a1a1a" />
              <span>Liên Hệ Ngay</span>
            </button>
            <button className="border border-luxury-gold text-luxury-gold px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-luxury-gold hover:text-deep-black transition-all flex items-center justify-center space-x-2">
              <IonIcon icon="storefront-outline" size={18} />
              <span>Xem Sản Phẩm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;