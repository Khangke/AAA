import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products?featured=true`);
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Fallback to static data if API fails
      setFeaturedProducts([
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
        }
      ]);
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
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-deep-black to-charcoal">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Hero Section - Compact */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-deep-black font-bold text-2xl sm:text-3xl">K</span>
            </div>
            <h1 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-luxury-gold via-warm-gold to-luxury-copper bg-clip-text text-transparent">
              Khang Trầm Hương
            </h1>
          </div>
          
          <p className="text-soft-gold text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">
            Tinh Hoa Trầm Hương Việt Nam • Chất Lượng Luxury • 20+ Năm Kinh Nghiệm
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center max-w-md mx-auto">
            <button className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-lg transition-all">
              Khám Phá Sản Phẩm
            </button>
            <button className="border border-luxury-gold text-luxury-gold px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-luxury-gold hover:text-deep-black transition-all">
              Liên Hệ Ngay
            </button>
          </div>
        </div>

        {/* Products Section - Compact */}
        <div className="mb-8 sm:mb-12">
          <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-3 sm:mb-6 text-center">
            🌟 Sản Phẩm Nổi Bật
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-deep-black/50 rounded-xl overflow-hidden border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all cursor-pointer group">
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-gold font-bold text-sm sm:text-base">
                      {product.price}
                    </span>
                    <button className="bg-luxury-gold text-deep-black px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-luxury-copper transition-colors">
                      Xem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4 sm:mt-6">
            <button className="text-luxury-gold hover:text-luxury-copper transition-colors text-sm sm:text-base underline">
              Xem Tất Cả Sản Phẩm →
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
            <button className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-lg transition-all">
              📞 Liên Hệ Ngay
            </button>
            <button className="border border-luxury-gold text-luxury-gold px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-luxury-gold hover:text-deep-black transition-all">
              🛍️ Xem Sản Phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;