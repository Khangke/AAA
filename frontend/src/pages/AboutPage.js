import React, { useState } from 'react';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('story');

  const tabs = [
    { id: 'story', name: 'Câu Chuyện', icon: '📖' },
    { id: 'process', name: 'Quy Trình', icon: '⚒️' },
    { id: 'values', name: 'Giá Trị', icon: '💎' },
    { id: 'heritage', name: 'Di Sản', icon: '🏛️' }
  ];

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-deep-black to-charcoal">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        
        {/* Header - Very Compact */}
        <div className="text-center mb-3 sm:mb-6">
          <h1 className="font-luxury text-lg sm:text-3xl md:text-4xl font-bold text-luxury-gold mb-1 sm:mb-3">
            Khang Trầm Hương
          </h1>
          <p className="text-soft-gold text-xs sm:text-base max-w-xl mx-auto">
            20 năm kinh nghiệm • Nghệ nhân tâm huyết • Chất lượng cao cấp
          </p>
        </div>

        {/* Hero Image - Much Smaller */}
        <div className="mb-3 sm:mb-6">
          <div className="relative h-24 sm:h-48 md:h-64 rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1639390167093-9c62311fe84d"
              alt="Khang Trầm Hương"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 to-transparent"></div>
            <div className="absolute bottom-1 sm:bottom-3 left-1 sm:left-3 right-1 sm:right-3 text-center">
              <h2 className="font-luxury text-xs sm:text-lg md:text-xl font-bold text-luxury-gold mb-0.5 sm:mb-1">
                "Từ Tâm Huyết Đến Tinh Hoa"
              </h2>
              <p className="text-soft-gold text-3xs sm:text-sm">
                Mỗi sản phẩm là một tác phẩm nghệ thuật
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile Friendly */}
        <div className="mb-3 sm:mb-6">
          <div className="flex gap-1 sm:gap-2 justify-center overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-2 py-1 sm:px-4 sm:py-2 rounded-full text-3xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-luxury-gold text-deep-black'
                    : 'bg-deep-black/50 text-soft-gold border border-luxury-gold/20 hover:bg-luxury-gold/10'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-deep-black/50 rounded-xl p-3 sm:p-6 border border-luxury-gold/20">
          
          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h3 className="font-luxury text-base sm:text-2xl font-bold text-luxury-gold mb-2 sm:mb-4">
                  Hành Trình Đam Mê
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-4 rounded-lg border-l-3 border-luxury-gold">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-xl mr-2">🌱</span>
                    <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold">
                      Khởi Đầu (2004)
                    </h4>
                  </div>
                  <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                    Nghệ nhân Nguyễn Văn Khang bắt đầu từ niềm đam mê với trầm hương Nha Trang. 
                    Từ xưởng nhỏ đến thương hiệu uy tín, chúng tôi không ngừng học hỏi và cải tiến.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-4 rounded-lg border-l-3 border-luxury-gold">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-xl mr-2">🏆</span>
                    <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold">
                      Thành Tựu
                    </h4>
                  </div>
                  <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                    50,000+ khách hàng tin tưởng • Top thương hiệu trầm hương Việt Nam • 
                    Chứng nhận chất lượng quốc tế • Xuất khẩu 15+ quốc gia
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 sm:p-4 rounded-lg text-center">
                <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold mb-2">
                  Tầm Nhìn & Sứ Mệnh
                </h4>
                <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                  <strong className="text-luxury-gold">Tầm nhìn:</strong> Đưa trầm hương Việt Nam ra thế giới<br/>
                  <strong className="text-luxury-gold">Sứ mệnh:</strong> Mang tinh hoa thiên nhiên đến mọi gia đình
                </p>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <h3 className="font-luxury text-base sm:text-2xl font-bold text-luxury-gold mb-2 sm:mb-4">
                  Sản Phẩm Đặc Trưng
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-3 rounded-lg text-center border border-luxury-gold/20">
                  <div className="text-lg sm:text-2xl mb-1">🌿</div>
                  <h4 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1">
                    Trầm Bột Premium
                  </h4>
                  <p className="text-soft-gold text-3xs sm:text-xs">
                    Nguyên chất 100% • Hương thơm lâu phai
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-3 rounded-lg text-center border border-luxury-gold/20">
                  <div className="text-lg sm:text-2xl mb-1">🔥</div>
                  <h4 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1">
                    Nhang Trầm Thủ Công
                  </h4>
                  <p className="text-soft-gold text-3xs sm:text-xs">
                    Làm bằng tay • Không khói • Cháy đều
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-3 rounded-lg text-center border border-luxury-gold/20">
                  <div className="text-lg sm:text-2xl mb-1">💍</div>
                  <h4 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1">
                    Vòng Tay Phong Thủy
                  </h4>
                  <p className="text-soft-gold text-3xs sm:text-xs">
                    Đá quý tự nhiên • Mang lại may mắn
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-3 rounded-lg text-center border border-luxury-gold/20">
                  <div className="text-lg sm:text-2xl mb-1">🏺</div>
                  <h4 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1">
                    Trầm Khối Sưu Tầm
                  </h4>
                  <p className="text-soft-gold text-3xs sm:text-xs">
                    Hàng hiếm • Giá trị đầu tư
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-3 rounded-lg text-center border border-luxury-gold/20 col-span-2 sm:col-span-1">
                  <div className="text-lg sm:text-2xl mb-1">🎁</div>
                  <h4 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1">
                    Gift Sets Luxury
                  </h4>
                  <p className="text-soft-gold text-3xs sm:text-xs">
                    Quà tặng cao cấp • Đóng gói sang trọng
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 sm:p-4 rounded-lg">
                <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-2 text-center">
                  Cam Kết Chất Lượng
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-soft-gold">
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>100% tự nhiên</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>Chứng nhận chất lượng</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>Bảo hành trọn đời</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>Đổi trả miễn phí</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Values Tab */}
          {activeTab === 'values' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <h3 className="font-luxury text-base sm:text-2xl font-bold text-luxury-gold mb-2 sm:mb-4">
                  Giá Trị Cốt Lõi
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm">🌟</span>
                    </div>
                    <div>
                      <h4 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                        Chất Lượng Đỉnh Cao
                      </h4>
                      <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                        Từng sản phẩm đều qua kiểm định nghiêm ngặt, đảm bảo tiêu chuẩn quốc tế cao nhất.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm">🤝</span>
                    </div>
                    <div>
                      <h4 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                        Tín Nhiệm Hàng Đầu
                      </h4>
                      <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                        Uy tín được xây dựng qua 20 năm, với hàng chục nghìn khách hàng tin tưởng.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm">🎨</span>
                    </div>
                    <div>
                      <h4 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                        Nghệ Thuật Tinh Hoa
                      </h4>
                      <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                        Mỗi sản phẩm là tác phẩm nghệ thuật, thể hiện tâm hồn và kỹ thuật cao của nghệ nhân.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm">🌱</span>
                    </div>
                    <div>
                      <h4 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                        Phát Triển Bền Vững
                      </h4>
                      <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                        Cam kết bảo vệ môi trường và phát triển cộng đồng một cách bền vững.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 sm:p-4 rounded-lg">
                <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-2 text-center">
                  Thành Tựu Nổi Bật
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-luxury-gold font-bold text-lg sm:text-xl">50K+</div>
                    <div className="text-soft-gold text-3xs sm:text-xs">Khách hàng</div>
                  </div>
                  <div>
                    <div className="text-luxury-gold font-bold text-lg sm:text-xl">20+</div>
                    <div className="text-soft-gold text-3xs sm:text-xs">Năm kinh nghiệm</div>
                  </div>
                  <div>
                    <div className="text-luxury-gold font-bold text-lg sm:text-xl">15+</div>
                    <div className="text-soft-gold text-3xs sm:text-xs">Quốc gia xuất khẩu</div>
                  </div>
                  <div>
                    <div className="text-luxury-gold font-bold text-lg sm:text-xl">100%</div>
                    <div className="text-soft-gold text-3xs sm:text-xs">Hài lòng</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <h3 className="font-luxury text-base sm:text-2xl font-bold text-luxury-gold mb-2 sm:mb-4">
                  Kết Nối Với Chúng Tôi
                </h3>
                <p className="text-soft-gold text-xs sm:text-sm mb-3 sm:mb-4">
                  Hãy để chúng tôi đồng hành cùng bạn khám phá thế giới trầm hương
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-4 rounded-lg">
                  <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-2 flex items-center">
                    <span className="mr-2">🏪</span>
                    Showroom Chính
                  </h4>
                  <p className="text-soft-gold text-xs sm:text-sm">
                    📍 123 Đường Trầm Hương, Nha Trang<br/>
                    ⏰ 8:00 - 20:00 (T2-CN)<br/>
                    📞 0123 456 789
                  </p>
                </div>

                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-4 rounded-lg">
                  <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-2 flex items-center">
                    <span className="mr-2">🌐</span>
                    Kênh Online
                  </h4>
                  <p className="text-soft-gold text-xs sm:text-sm">
                    💬 Facebook: Khang Trầm Hương<br/>
                    📱 Zalo: 0123 456 789<br/>
                    ✉️ info@khangtramhuong.com
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-3 sm:mb-4">
                  <button className="bg-luxury-gold text-deep-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold hover:bg-luxury-copper transition-colors text-xs sm:text-base">
                    📞 Gọi Ngay
                  </button>
                  <button className="border border-luxury-gold text-luxury-gold px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold hover:bg-luxury-gold hover:text-deep-black transition-colors text-xs sm:text-base">
                    🛍️ Xem Sản Phẩm
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-2">
                    Ưu Đãi Đặc Biệt
                  </h4>
                  <p className="text-soft-gold text-xs sm:text-sm">
                    🎁 Giảm 10% cho khách hàng đầu tiên<br/>
                    🚚 Miễn phí ship toàn quốc đơn từ 500K<br/>
                    💎 Tặng kèm hộp gỗ cao cấp
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;