import React, { useState, useEffect, useCallback, useMemo } from 'react';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Memoize hero background images for better performance
  const heroImages = useMemo(() => [
    'https://images.unsplash.com/photo-1608828201317-ce72715cb12a',
    'https://images.unsplash.com/photo-1603201667230-bd54a8b9d8b7',
    'https://images.unsplash.com/photo-1590819477338-a0e3c6b8a31c'
  ], []);

  // Preload images for better UX
  useEffect(() => {
    const preloadImages = () => {
      heroImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };
    preloadImages();
  }, [heroImages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY;
    const parallax = scrolled * 0.5;
    
    const heroElement = document.querySelector('.hero-bg');
    if (heroElement) {
      heroElement.style.transform = `translateY(${parallax}px)`;
    }
  }, []);

  useEffect(() => {
    let timeoutId;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleScroll(), 10);
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Memoized product data
  const featuredProducts = useMemo(() => [
    {
      id: 1,
      name: 'Vòng Trầm Hương Cao Cấp',
      description: 'Vòng tay trầm hương nguyên chất, mang lại may mắn và bình an',
      price: '2.500.000₫',
      image: 'https://images.unsplash.com/photo-1662473217799-6e7288f19741',
      alt: 'Vòng Trầm Hương'
    },
    {
      id: 2,
      name: 'Trầm Hương Nguyên Khối',
      description: 'Khối trầm hương tự nhiên, hương thơm nồng nàn, quý hiếm',
      price: '5.800.000₫',
      image: 'https://images.unsplash.com/photo-1719611639294-f754d39a6bed',
      alt: 'Trầm Hương Nguyên Khối'
    },
    {
      id: 3,
      name: 'Nhang Trầm Hương Premium',
      description: 'Nhang trầm hương cao cấp, thích hợp cho không gian thiền định',
      price: '850.000₫',
      image: 'https://images.unsplash.com/photo-1652959889888-53d048374e35',
      alt: 'Nhang Trầm Hương'
    },
    {
      id: 4,
      name: 'Trầm Hương Thiền Định',
      description: 'Trầm hương đặc biệt dành cho thiền định và tâm linh',
      price: '3.200.000₫',
      image: 'https://images.unsplash.com/photo-1589115324861-b757b1dd2247',
      alt: 'Trầm Hương Thiền'
    },
    {
      id: 5,
      name: 'Bộ Sưu Tập Luxury',
      description: 'Bộ sưu tập trầm hương cao cấp đặc biệt, phiên bản giới hạn',
      price: '12.500.000₫',
      image: 'https://images.pexels.com/photos/6998574/pexels-photo-6998574.jpeg',
      alt: 'Bộ Sưu Tập Trầm Hương'
    }
  ], []);

  const ProductCard = React.memo(({ product, index }) => (
    <div className={`flex-shrink-0 w-full xs:w-80 sm:w-auto bg-deep-black/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105 will-change-transform animate-fade-in-up`}
         style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="h-36 xs:h-40 sm:h-48 bg-gradient-to-br from-luxury-gold/20 to-luxury-copper/20 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image} 
          alt={product.alt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="p-4 xs:p-6">
        <h3 className="font-luxury text-lg xs:text-xl font-bold text-luxury-gold mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-soft-gold mb-4 text-sm xs:text-base line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-luxury-gold font-bold text-base xs:text-lg">
            {product.price}
          </span>
          <button className="bg-luxury-gold text-deep-black px-3 xs:px-4 py-2 rounded-full font-bold text-sm xs:text-base hover:bg-luxury-copper transition-colors min-h-[44px]">
            Xem Chi Tiết
          </button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="hero-bg absolute inset-0 z-0 will-change-transform"
          style={{
            backgroundImage: `url('${heroImages[currentImageIndex]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-deep-black/80 via-deep-black/60 to-deep-black/90"></div>
        </div>

        {/* Content */}
        <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Logo */}
          <div className="mb-6 xs:mb-8">
            <div className="w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <span className="text-deep-black font-bold text-2xl xs:text-3xl sm:text-4xl">K</span>
            </div>
            <h1 className="font-luxury text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-luxury-gold via-warm-gold to-luxury-copper bg-clip-text text-transparent leading-tight">
              Khang Trầm Hương
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg xs:text-xl sm:text-2xl text-soft-gold mb-6 xs:mb-8 leading-relaxed">
            Tinh Hoa Trầm Hương Việt Nam<br />
            <span className="text-luxury-gold">Chất Lượng Luxury - Giá Trị Vĩnh Cửu</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center items-center">
            <button className="w-full sm:w-auto bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 xs:px-8 py-3 xs:py-4 rounded-full font-bold text-base xs:text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105 min-h-[44px]">
              Khám Phá Sản Phẩm
            </button>
            <button className="w-full sm:w-auto border-2 border-luxury-gold text-luxury-gold px-6 xs:px-8 py-3 xs:py-4 rounded-full font-bold text-base xs:text-lg hover:bg-luxury-gold hover:text-deep-black transition-all duration-300 transform hover:scale-105 min-h-[44px]">
              Liên Hệ Tư Vấn
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 xs:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
            <div className="w-5 xs:w-6 h-8 xs:h-10 border-2 border-luxury-gold rounded-full flex justify-center">
              <div className="w-1 h-2 xs:h-3 bg-luxury-gold rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="py-16 xs:py-20 bg-gradient-to-b from-deep-black to-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 xs:mb-16">
            <h2 className="font-luxury text-2xl xs:text-3xl sm:text-4xl font-bold text-luxury-gold mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-soft-gold text-base xs:text-lg max-w-2xl mx-auto">
              Khám phá bộ sưu tập trầm hương cao cấp được yêu thích nhất
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
            {featuredProducts.slice(0, 3).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto space-x-4 xs:space-x-6 pb-6 px-4 -mx-4 scrollbar-hide product-scroll">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {featuredProducts.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === 0 ? 'bg-luxury-gold' : 'bg-luxury-gold/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Swipe Hint */}
            <div className="text-center mt-4">
              <p className="text-soft-gold/70 text-sm">
                ← Lướt qua để xem thêm sản phẩm →
              </p>
            </div>
          </div>

          <div className="text-center mt-8 xs:mt-12">
            <button className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 xs:px-8 py-3 xs:py-4 rounded-full font-bold text-base xs:text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105 min-h-[44px]">
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 xs:py-20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 xs:mb-16">
            <h2 className="font-luxury text-2xl xs:text-3xl sm:text-4xl font-bold text-luxury-gold mb-4">
              Tại Sao Chọn Khang Trầm Hương?
            </h2>
            <p className="text-soft-gold text-base xs:text-lg max-w-2xl mx-auto">
              Chúng tôi tự hào mang đến những sản phẩm trầm hương cao cấp nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 xs:p-8 bg-charcoal/50 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105 will-change-transform">
              <div className="w-12 xs:w-16 h-12 xs:h-16 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-4 xs:mb-6">
                <span className="text-xl xs:text-2xl">🌿</span>
              </div>
              <h3 className="font-luxury text-lg xs:text-xl font-bold text-luxury-gold mb-3 xs:mb-4">
                100% Tự Nhiên
              </h3>
              <p className="text-soft-gold text-sm xs:text-base">
                Trầm hương nguyên chất, không pha tạp, được tuyển chọn kỹ lưỡng từ những cây trầm quý hiếm nhất
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 xs:p-8 bg-charcoal/50 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105 will-change-transform">
              <div className="w-12 xs:w-16 h-12 xs:h-16 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-4 xs:mb-6">
                <span className="text-xl xs:text-2xl">👑</span>
              </div>
              <h3 className="font-luxury text-lg xs:text-xl font-bold text-luxury-gold mb-3 xs:mb-4">
                Chất Lượng Luxury
              </h3>
              <p className="text-soft-gold text-sm xs:text-base">
                Từng sản phẩm được chế tác tỉ mỉ, kiểm tra chất lượng nghiêm ngặt, đạt tiêu chuẩn luxury cao cấp
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 xs:p-8 bg-charcoal/50 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105 will-change-transform">
              <div className="w-12 xs:w-16 h-12 xs:h-16 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-4 xs:mb-6">
                <span className="text-xl xs:text-2xl">🏆</span>
              </div>
              <h3 className="font-luxury text-lg xs:text-xl font-bold text-luxury-gold mb-3 xs:mb-4">
                Uy Tín Lâu Năm
              </h3>
              <p className="text-soft-gold text-sm xs:text-base">
                Hơn 20 năm kinh nghiệm trong ngành, phục vụ hàng ngàn khách hàng tin tưởng trên toàn quốc
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 xs:py-20 bg-gradient-to-b from-charcoal to-deep-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 xs:mb-16">
            <h2 className="font-luxury text-2xl xs:text-3xl sm:text-4xl font-bold text-luxury-gold mb-4">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-soft-gold text-base xs:text-lg max-w-2xl mx-auto">
              Hàng ngàn khách hàng tin tưởng và hài lòng với chất lượng sản phẩm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-deep-black/50 p-6 xs:p-8 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300">
              <div className="flex items-center mb-4 xs:mb-6">
                <div className="w-10 xs:w-12 h-10 xs:h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-3 xs:mr-4">
                  <span className="text-deep-black font-bold text-sm xs:text-base">A</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold text-sm xs:text-base">Anh Minh</h4>
                  <p className="text-soft-gold text-xs xs:text-sm">TP. Hồ Chí Minh</p>
                </div>
              </div>
              <p className="text-soft-gold italic mb-3 xs:mb-4 text-sm xs:text-base">
                "Trầm hương ở đây chất lượng thật sự tuyệt vời. Hương thơm rất đậm đà và tự nhiên. Tôi đã mua nhiều lần và luôn hài lòng!"
              </p>
              <div className="flex text-luxury-gold text-sm xs:text-base">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-deep-black/50 p-6 xs:p-8 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300">
              <div className="flex items-center mb-4 xs:mb-6">
                <div className="w-10 xs:w-12 h-10 xs:h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-3 xs:mr-4">
                  <span className="text-deep-black font-bold text-sm xs:text-base">L</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold text-sm xs:text-base">Chị Lan</h4>
                  <p className="text-soft-gold text-xs xs:text-sm">Hà Nội</p>
                </div>
              </div>
              <p className="text-soft-gold italic mb-3 xs:mb-4 text-sm xs:text-base">
                "Phục vụ tận tình, sản phẩm đúng như mô tả. Vòng trầm hương rất đẹp và chất lượng. Sẽ giới thiệu cho bạn bè!"
              </p>
              <div className="flex text-luxury-gold text-sm xs:text-base">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-deep-black/50 p-6 xs:p-8 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300">
              <div className="flex items-center mb-4 xs:mb-6">
                <div className="w-10 xs:w-12 h-10 xs:h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-3 xs:mr-4">
                  <span className="text-deep-black font-bold text-sm xs:text-base">H</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold text-sm xs:text-base">Anh Hưng</h4>
                  <p className="text-soft-gold text-xs xs:text-sm">Đà Nẵng</p>
                </div>
              </div>
              <p className="text-soft-gold italic mb-3 xs:mb-4 text-sm xs:text-base">
                "Mua làm quà tặng cho bố mẹ, họ rất thích. Chất lượng trầm hương thật sự cao cấp, xứng đáng với giá tiền!"
              </p>
              <div className="flex text-luxury-gold text-sm xs:text-base">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xs:py-20 bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-deep-black/50 p-8 xs:p-12 rounded-3xl backdrop-blur-sm border border-luxury-gold/30">
            <h2 className="font-luxury text-2xl xs:text-3xl sm:text-4xl font-bold text-luxury-gold mb-4 xs:mb-6">
              Sẵn Sàng Trải Nghiệm Trầm Hương Cao Cấp?
            </h2>
            <p className="text-soft-gold text-base xs:text-lg mb-6 xs:mb-8 max-w-2xl mx-auto">
              Liên hệ ngay với chúng tôi để được tư vấn và lựa chọn sản phẩm phù hợp nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center items-center">
              <button className="w-full sm:w-auto bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 xs:px-8 py-3 xs:py-4 rounded-full font-bold text-base xs:text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105 min-h-[44px]">
                Liên Hệ Ngay
              </button>
              <button className="w-full sm:w-auto border-2 border-luxury-gold text-luxury-gold px-6 xs:px-8 py-3 xs:py-4 rounded-full font-bold text-base xs:text-lg hover:bg-luxury-gold hover:text-deep-black transition-all duration-300 transform hover:scale-105 min-h-[44px]">
                Xem Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-black border-t border-luxury-gold/20 py-8 xs:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 xs:gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 xs:w-10 h-8 xs:h-10 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
                  <span className="text-deep-black font-bold text-sm xs:text-lg">K</span>
                </div>
                <span className="text-luxury-gold font-luxury text-lg xs:text-xl font-bold">
                  Khang Trầm Hương
                </span>
              </div>
              <p className="text-soft-gold mb-4 text-sm xs:text-base">
                Chuyên cung cấp trầm hương cao cấp, chất lượng luxury với hơn 20 năm kinh nghiệm trong ngành.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-luxury-gold hover:text-luxury-copper transition-colors text-sm xs:text-base">
                  Facebook
                </a>
                <a href="#" className="text-luxury-gold hover:text-luxury-copper transition-colors text-sm xs:text-base">
                  Instagram
                </a>
                <a href="#" className="text-luxury-gold hover:text-luxury-copper transition-colors text-sm xs:text-base">
                  Zalo
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-luxury text-base xs:text-lg font-bold text-luxury-gold mb-3 xs:mb-4">
                Liên Kết
              </h4>
              <ul className="space-y-1 xs:space-y-2">
                <li><a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors text-sm xs:text-base">Về Chúng Tôi</a></li>
                <li><a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors text-sm xs:text-base">Sản Phẩm</a></li>
                <li><a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors text-sm xs:text-base">Tin Tức</a></li>
                <li><a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors text-sm xs:text-base">Liên Hệ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-luxury text-base xs:text-lg font-bold text-luxury-gold mb-3 xs:mb-4">
                Liên Hệ
              </h4>
              <div className="space-y-1 xs:space-y-2 text-soft-gold text-sm xs:text-base">
                <p>📞 0123 456 789</p>
                <p>✉️ info@khangtramhuong.com</p>
                <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-luxury-gold/20 mt-8 xs:mt-12 pt-6 xs:pt-8 text-center text-soft-gold text-sm xs:text-base">
            <p>&copy; 2024 Khang Trầm Hương. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;