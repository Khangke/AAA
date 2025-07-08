import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1608828201317-ce72715cb12a')`,
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
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <span className="text-deep-black font-bold text-4xl">K</span>
            </div>
            <h1 className="font-luxury text-4xl md:text-6xl font-bold bg-gradient-to-r from-luxury-gold via-warm-gold to-luxury-copper bg-clip-text text-transparent leading-tight">
              Khang Trầm Hương
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-soft-gold mb-8 leading-relaxed">
            Tinh Hoa Trầm Hương Việt Nam<br />
            <span className="text-luxury-gold">Chất Lượng Luxury - Giá Trị Vĩnh Cửu</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105">
              Khám Phá Sản Phẩm
            </button>
            <button className="border-2 border-luxury-gold text-luxury-gold px-8 py-4 rounded-full font-bold text-lg hover:bg-luxury-gold hover:text-deep-black transition-all duration-300 transform hover:scale-105">
              Liên Hệ Tư Vấn
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-luxury-gold rounded-full flex justify-center">
              <div className="w-1 h-3 bg-luxury-gold rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-luxury-gold mb-4">
              Tại Sao Chọn Khang Trầm Hương?
            </h2>
            <p className="text-soft-gold text-lg max-w-2xl mx-auto">
              Chúng tôi tự hào mang đến những sản phẩm trầm hương cao cấp nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-charcoal/50 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-4">
                100% Tự Nhiên
              </h3>
              <p className="text-soft-gold">
                Trầm hương nguyên chất, không pha tạp, được tuyển chọn kỹ lưỡng từ những cây trầm quý hiếm nhất
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-charcoal/50 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-4">
                Chất Lượng Luxury
              </h3>
              <p className="text-soft-gold">
                Từng sản phẩm được chế tác tỉ mỉ, kiểm tra chất lượng nghiêm ngặt, đạt tiêu chuẩn luxury cao cấp
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-charcoal/50 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-4">
                Uy Tín Lâu Năm
              </h3>
              <p className="text-soft-gold">
                Hơn 20 năm kinh nghiệm trong ngành, phục vụ hàng ngàn khách hàng tin tưởng trên toàn quốc
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-charcoal to-deep-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-luxury-gold mb-4">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-soft-gold text-lg max-w-2xl mx-auto">
              Hàng ngàn khách hàng tin tưởng và hài lòng với chất lượng sản phẩm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-deep-black/50 p-8 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-4">
                  <span className="text-deep-black font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold">Anh Minh</h4>
                  <p className="text-soft-gold text-sm">TP. Hồ Chí Minh</p>
                </div>
              </div>
              <p className="text-soft-gold italic mb-4">
                "Trầm hương ở đây chất lượng thật sự tuyệt vời. Hương thơm rất đậm đà và tự nhiên. Tôi đã mua nhiều lần và luôn hài lòng!"
              </p>
              <div className="flex text-luxury-gold">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-deep-black/50 p-8 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-4">
                  <span className="text-deep-black font-bold">L</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold">Chị Lan</h4>
                  <p className="text-soft-gold text-sm">Hà Nội</p>
                </div>
              </div>
              <p className="text-soft-gold italic mb-4">
                "Phục vụ tận tình, sản phẩm đúng như mô tả. Vòng trầm hương rất đẹp và chất lượng. Sẽ giới thiệu cho bạn bè!"
              </p>
              <div className="flex text-luxury-gold">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-deep-black/50 p-8 rounded-2xl backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-4">
                  <span className="text-deep-black font-bold">H</span>
                </div>
                <div>
                  <h4 className="font-bold text-luxury-gold">Anh Hưng</h4>
                  <p className="text-soft-gold text-sm">Đà Nẵng</p>
                </div>
              </div>
              <p className="text-soft-gold italic mb-4">
                "Mua làm quà tặng cho bố mẹ, họ rất thích. Chất lượng trầm hương thật sự cao cấp, xứng đáng với giá tiền!"
              </p>
              <div className="flex text-luxury-gold">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Products Preview Section */}
      <section className="py-20 bg-gradient-to-b from-deep-black to-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-luxury-gold mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-soft-gold text-lg max-w-2xl mx-auto">
              Khám phá bộ sưu tập trầm hương cao cấp được yêu thích nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-deep-black/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-luxury-gold/20 to-luxury-copper/20 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1662473217799-6e7288f19741" 
                  alt="Vòng Trầm Hương"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-2">
                  Vòng Trầm Hương Cao Cấp
                </h3>
                <p className="text-soft-gold mb-4">
                  Vòng tay trầm hương nguyên chất, mang lại may mắn và bình an
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-luxury-gold font-bold text-lg">
                    2.500.000₫
                  </span>
                  <button className="bg-luxury-gold text-deep-black px-4 py-2 rounded-full font-bold hover:bg-luxury-copper transition-colors">
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-deep-black/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-luxury-gold/20 to-luxury-copper/20 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1719611639294-f754d39a6bed" 
                  alt="Trầm Hương Nguyên Khối"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-2">
                  Trầm Hương Nguyên Khối
                </h3>
                <p className="text-soft-gold mb-4">
                  Khối trầm hương tự nhiên, hương thơm nồng nàn, quý hiếm
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-luxury-gold font-bold text-lg">
                    5.800.000₫
                  </span>
                  <button className="bg-luxury-gold text-deep-black px-4 py-2 rounded-full font-bold hover:bg-luxury-copper transition-colors">
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-deep-black/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-luxury-gold/20 to-luxury-copper/20 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1652959889888-53d048374e35" 
                  alt="Nhang Trầm Hương"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-luxury text-xl font-bold text-luxury-gold mb-2">
                  Nhang Trầm Hương Premium
                </h3>
                <p className="text-soft-gold mb-4">
                  Nhang trầm hương cao cấp, thích hợp cho không gian thiền định
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-luxury-gold font-bold text-lg">
                    850.000₫
                  </span>
                  <button className="bg-luxury-gold text-deep-black px-4 py-2 rounded-full font-bold hover:bg-luxury-copper transition-colors">
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105">
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-deep-black/50 p-12 rounded-3xl backdrop-blur-sm border border-luxury-gold/30">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-luxury-gold mb-6">
              Sẵn Sàng Trải Nghiệm Trầm Hương Cao Cấp?
            </h2>
            <p className="text-soft-gold text-lg mb-8 max-w-2xl mx-auto">
              Liên hệ ngay với chúng tôi để được tư vấn và lựa chọn sản phẩm phù hợp nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105">
                Liên Hệ Ngay
              </button>
              <button className="border-2 border-luxury-gold text-luxury-gold px-8 py-4 rounded-full font-bold text-lg hover:bg-luxury-gold hover:text-deep-black transition-all duration-300 transform hover:scale-105">
                Xem Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-black border-t border-luxury-gold/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
                  <span className="text-deep-black font-bold text-lg">K</span>
                </div>
                <span className="text-luxury-gold font-luxury text-xl font-bold">
                  Khang Trầm Hương
                </span>
              </div>
              <p className="text-soft-gold mb-4">
                Chuyên cung cấp trầm hương cao cấp, chất lượng luxury với hơn 20 năm kinh nghiệm trong ngành.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-luxury-gold hover:text-luxury-copper transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-luxury-gold hover:text-luxury-copper transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-luxury-gold hover:text-luxury-copper transition-colors">
                  Zalo
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-luxury text-lg font-bold text-luxury-gold mb-4">
                Liên Kết
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors">Về Chúng Tôi</a></li>
                <li><a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors">Sản Phẩm</a></li>
                <li><a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors">Tin Tức</a></li>
                <li><a href="#" className="text-soft-gold hover:text-luxury-gold transition-colors">Liên Hệ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-luxury text-lg font-bold text-luxury-gold mb-4">
                Liên Hệ
              </h4>
              <div className="space-y-2 text-soft-gold">
                <p>📞 0123 456 789</p>
                <p>✉️ info@khangtramhuong.com</p>
                <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-luxury-gold/20 mt-12 pt-8 text-center text-soft-gold">
            <p>&copy; 2024 Khang Trầm Hương. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;