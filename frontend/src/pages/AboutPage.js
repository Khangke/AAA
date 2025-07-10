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
    <div className="min-h-screen pt-16 md:pt-20 bg-deep-black mobile-nav-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-luxury text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-luxury-gold mb-2 sm:mb-4">
            Giới Thiệu Khang Trầm Hương
          </h1>
          <p className="text-soft-gold text-sm sm:text-base">
            Hành trình 20 năm với tinh hoa trầm hương Việt Nam
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

          {/* Process Tab */}
          {activeTab === 'process' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <h3 className="font-luxury text-base sm:text-2xl font-bold text-luxury-gold mb-2 sm:mb-4">
                  Quy Trình Chế Tác
                </h3>
                <p className="text-soft-gold text-xs sm:text-sm mb-3">
                  Từ nguyên liệu thô đến sản phẩm hoàn thiện
                </p>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 rounded-lg border-l-3 border-luxury-gold">
                    <div className="flex items-center mb-2">
                      <span className="text-base mr-2">🌲</span>
                      <h4 className="font-luxury text-sm font-bold text-luxury-gold">
                        1. Tuyển Chọn Nguyên Liệu
                      </h4>
                    </div>
                    <p className="text-soft-gold text-xs leading-relaxed">
                      Chọn lọc trầm hương tự nhiên từ rừng Nha Trang, kiểm tra độ tinh khiết và chất lượng dầu thơm.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 rounded-lg border-l-3 border-luxury-gold">
                    <div className="flex items-center mb-2">
                      <span className="text-base mr-2">🔍</span>
                      <h4 className="font-luxury text-sm font-bold text-luxury-gold">
                        2. Phân Loại & Kiểm Định
                      </h4>
                    </div>
                    <p className="text-soft-gold text-xs leading-relaxed">
                      Phân loại theo độ tuổi, mùi hương và chất lượng. Mỗi khối trầm được kiểm định kỹ lưỡng.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 rounded-lg border-l-3 border-luxury-gold">
                    <div className="flex items-center mb-2">
                      <span className="text-base mr-2">👨‍🎨</span>
                      <h4 className="font-luxury text-sm font-bold text-luxury-gold">
                        3. Chế Tác Thủ Công
                      </h4>
                    </div>
                    <p className="text-soft-gold text-xs leading-relaxed">
                      Nghệ nhân tâm huyết chế tác từng sản phẩm, giữ gìn tinh hoa và linh hồn của trầm hương.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 rounded-lg border-l-3 border-luxury-gold">
                    <div className="flex items-center mb-2">
                      <span className="text-base mr-2">✨</span>
                      <h4 className="font-luxury text-sm font-bold text-luxury-gold">
                        4. Hoàn Thiện & Đóng Gói
                      </h4>
                    </div>
                    <p className="text-soft-gold text-xs leading-relaxed">
                      Kiểm tra chất lượng cuối cùng, đóng gói trong hộp gỗ cao cấp với giấy chứng nhận.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 rounded-lg">
                  <h4 className="font-luxury text-sm font-bold text-luxury-gold mb-2 text-center">
                    Đội Ngũ Nghệ Nhân
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg">👨‍🏫</span>
                      </div>
                      <h5 className="font-luxury text-xs font-bold text-luxury-gold">Thầy Khang</h5>
                      <p className="text-soft-gold text-3xs">Người sáng lập</p>
                      <p className="text-soft-gold text-3xs">25+ năm kinh nghiệm</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg">👩‍🎨</span>
                      </div>
                      <h5 className="font-luxury text-xs font-bold text-luxury-gold">Cô Lan</h5>
                      <p className="text-soft-gold text-3xs">Chuyên gia phân loại</p>
                      <p className="text-soft-gold text-3xs">15+ năm kinh nghiệm</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg">👨‍🔬</span>
                      </div>
                      <h5 className="font-luxury text-xs font-bold text-luxury-gold">Anh Minh</h5>
                      <p className="text-soft-gold text-3xs">Kiểm định chất lượng</p>
                      <p className="text-soft-gold text-3xs">12+ năm kinh nghiệm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 rounded-lg">
                  <h4 className="font-luxury text-sm font-bold text-luxury-gold mb-2 text-center">
                    Tiêu Chuẩn Chất Lượng
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-soft-gold">
                    <div className="flex items-center">
                      <span className="mr-2">🏆</span>
                      <span>ISO 9001:2015</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🌿</span>
                      <span>Organic Certificate</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⭐</span>
                      <span>5 Sao Châu Á</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🔒</span>
                      <span>An Toàn Thực Phẩm</span>
                    </div>
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
                <p className="text-soft-gold text-xs sm:text-sm mb-3">
                  Những giá trị định hướng mọi hoạt động của chúng tôi
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/5 p-3 sm:p-4 rounded-lg border border-luxury-gold/20">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-xl mr-2">🤝</span>
                    <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold">
                      Tính Chân Thật
                    </h4>
                  </div>
                  <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                    Mỗi sản phẩm trầm hương đều được kiểm định kỹ lưỡng, đảm bảo 100% tự nhiên. 
                    Chúng tôi cam kết minh bạch về nguồn gốc và chất lượng với khách hàng.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/5 p-3 sm:p-4 rounded-lg border border-luxury-gold/20">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-xl mr-2">❤️</span>
                    <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold">
                      Tâm Huyết
                    </h4>
                  </div>
                  <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                    Từ quá trình tuyển chọn nguyên liệu đến chế tác thành phẩm, mỗi công đoạn 
                    đều được thực hiện với tâm huyết và tình yêu nghề nghiệp của nghệ nhân.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/5 p-3 sm:p-4 rounded-lg border border-luxury-gold/20">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-xl mr-2">🏆</span>
                    <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold">
                      Chất Lượng Đẳng Cấp
                    </h4>
                  </div>
                  <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                    Áp dụng tiêu chuẩn quốc tế trong từng khâu sản xuất. Chỉ những sản phẩm 
                    đạt chất lượng cao nhất mới được đưa đến tay khách hàng.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/5 p-3 sm:p-4 rounded-lg border border-luxury-gold/20">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-xl mr-2">🌱</span>
                    <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold">
                      Phát Triển Bền Vững
                    </h4>
                  </div>
                  <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                    Cam kết bảo vệ môi trường và phát triển bền vững. Chúng tôi hợp tác với 
                    các cộng đồng địa phương để bảo tồn rừng trầm hương.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/5 p-3 sm:p-4 rounded-lg border border-luxury-gold/20">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-xl mr-2">🎯</span>
                    <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold">
                      Tận Tâm Phục Vụ
                    </h4>
                  </div>
                  <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                    Đặt khách hàng làm trung tâm của mọi quyết định. Luôn lắng nghe và cải thiện 
                    để mang đến trải nghiệm tốt nhất cho khách hàng.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/5 p-3 sm:p-4 rounded-lg border border-luxury-gold/20">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-xl mr-2">🏛️</span>
                    <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold">
                      Kế Thừa Truyền Thống
                    </h4>
                  </div>
                  <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                    Gìn giữ và phát huy những giá trị văn hóa truyền thống của trầm hương Việt Nam, 
                    đồng thời ứng dụng công nghệ hiện đại trong sản xuất.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 sm:p-4 rounded-lg mt-4">
                <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold mb-3 text-center">
                  Cam Kết Với Khách Hàng
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-base sm:text-lg">💯</span>
                    </div>
                    <h5 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1">
                      Đảm Bảo Chất Lượng
                    </h5>
                    <p className="text-soft-gold text-3xs sm:text-xs">
                      Hoàn tiền 100% nếu không hài lòng
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-base sm:text-lg">🚚</span>
                    </div>
                    <h5 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1">
                      Giao Hàng Tận Nơi
                    </h5>
                    <p className="text-soft-gold text-3xs sm:text-xs">
                      Miễn phí giao hàng toàn quốc
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-base sm:text-lg">🎓</span>
                    </div>
                    <h5 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1">
                      Tư Vấn Chuyên Sâu
                    </h5>
                    <p className="text-soft-gold text-3xs sm:text-xs">
                      Hỗ trợ 24/7 từ chuyên gia
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-4 rounded-lg text-center">
                <h4 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold mb-2">
                  Thông Điệp Từ Người Sáng Lập
                </h4>
                <blockquote className="text-soft-gold text-xs sm:text-sm italic leading-relaxed">
                  "Chúng tôi không chỉ kinh doanh trầm hương, mà còn lan tỏa những giá trị tốt đẹp 
                  của văn hóa Việt Nam. Mỗi sản phẩm là một câu chuyện, mỗi hương thơm là một kỷ niệm 
                  đẹp mà chúng tôi muốn chia sẻ với khách hàng."
                </blockquote>
                <cite className="text-luxury-gold text-xs sm:text-sm font-semibold mt-2 block">
                  - Nghệ nhân Nguyễn Văn Khang, Người sáng lập
                </cite>
              </div>
            </div>
          )}

          {/* Heritage Tab */}
          {activeTab === 'heritage' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <h3 className="font-luxury text-base sm:text-2xl font-bold text-luxury-gold mb-2 sm:mb-4">
                  Di Sản Trầm Hương
                </h3>
                <p className="text-soft-gold text-xs sm:text-sm mb-3">
                  Kế thừa và phát huy truyền thống nghìn năm
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 rounded-lg border-l-3 border-luxury-gold">
                  <h4 className="font-luxury text-sm font-bold text-luxury-gold mb-2 flex items-center">
                    <span className="mr-2">🏛️</span>
                    Lịch Sử Trầm Hương Việt Nam
                  </h4>
                  <p className="text-soft-gold text-xs leading-relaxed">
                    Trầm hương Việt Nam có lịch sử hơn 1000 năm, được sử dụng trong cung đình và các nghi lễ tôn giáo. 
                    Vùng Nha Trang - Khánh Hòa là nơi sản sinh ra loại trầm hương chất lượng cao nhất thế giới.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-3 rounded-lg">
                    <h4 className="font-luxury text-sm font-bold text-luxury-gold mb-2 flex items-center">
                      <span className="mr-2">🌸</span>
                      Văn Hóa Tâm Linh
                    </h4>
                    <p className="text-soft-gold text-xs leading-relaxed">
                      • Thiền định và tĩnh tâm<br/>
                      • Lễ bái tổ tiên<br/>
                      • Y học cổ truyền<br/>
                      • Phong thủy và may mắn
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-3 rounded-lg">
                    <h4 className="font-luxury text-sm font-bold text-luxury-gold mb-2 flex items-center">
                      <span className="mr-2">🌍</span>
                      Danh Tiếng Quốc Tế
                    </h4>
                    <p className="text-soft-gold text-xs leading-relaxed">
                      • Xuất khẩu sang Nhật Bản<br/>
                      • Ấn Độ và Trung Đông<br/>
                      • Châu Âu và Mỹ<br/>
                      • Được UNESCO ghi nhận
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 rounded-lg">
                  <h4 className="font-luxury text-sm font-bold text-luxury-gold mb-2 text-center">
                    Triết Lý Kinh Doanh
                  </h4>
                  <div className="text-center">
                    <blockquote className="text-soft-gold text-xs sm:text-sm italic mb-3">
                      "Trầm hương không chỉ là sản phẩm, mà là cầu nối giữa con người với thiên nhiên, 
                      giữa thế hệ này với thế hệ khác, giữa hiện tại với truyền thống nghìn năm."
                    </blockquote>
                    <cite className="text-luxury-gold text-xs font-semibold">- Nghệ nhân Nguyễn Văn Khang</cite>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-luxury-gold/5 to-luxury-copper/5 p-3 rounded-lg">
                  <h4 className="font-luxury text-sm font-bold text-luxury-gold mb-2 text-center">
                    Tương Lai Phát Triển
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-luxury-gold font-bold text-base">2025</div>
                      <div className="text-soft-gold text-xs">Mở rộng quốc tế</div>
                    </div>
                    <div className="text-center">
                      <div className="text-luxury-gold font-bold text-base">2026</div>
                      <div className="text-soft-gold text-xs">Bảo tồn rừng trầm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-luxury-gold font-bold text-base">2030</div>
                      <div className="text-soft-gold text-xs">Thương hiệu toàn cầu</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 rounded-lg text-center">
                  <h4 className="font-luxury text-sm font-bold text-luxury-gold mb-2">
                    Cam Kết Bảo Tồn
                  </h4>
                  <p className="text-soft-gold text-xs leading-relaxed">
                    Chúng tôi cam kết bảo vệ và phát triển bền vững nguồn tài nguyên trầm hương, 
                    đồng thời truyền lại nghề cho thế hệ trẻ để duy trì di sản văn hóa quý giá này.
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