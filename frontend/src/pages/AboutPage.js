import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-deep-black to-charcoal">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Header - Compact */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="font-luxury text-xl sm:text-3xl md:text-4xl font-bold text-luxury-gold mb-2 sm:mb-4">
            Về Khang Trầm Hương
          </h1>
          <p className="text-soft-gold text-xs sm:text-base md:text-lg max-w-2xl mx-auto">
            Câu chuyện về hành trình 20 năm phát triển và tạo dựng thương hiệu trầm hương cao cấp
          </p>
        </div>

        {/* Hero Image - Compact */}
        <div className="mb-4 sm:mb-8">
          <div className="relative h-32 sm:h-64 md:h-80 rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1639390167093-9c62311fe84d"
              alt="Khang Trầm Hương"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent"></div>
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-center">
              <h2 className="font-luxury text-sm sm:text-xl md:text-2xl font-bold text-luxury-gold mb-1 sm:mb-2">
                Trầm Hương Cao Cấp
              </h2>
              <p className="text-soft-gold text-2xs sm:text-sm md:text-base">
                Tinh hoa từ thiên nhiên, tạo nên giá trị vĩnh cửu
              </p>
            </div>
          </div>
        </div>

        {/* Story Section - Compact */}
        <div className="mb-4 sm:mb-8">
          <div className="bg-deep-black/50 rounded-xl p-3 sm:p-6 md:p-8 border border-luxury-gold/20">
            <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-3 sm:mb-6 text-center">
              Câu Chuyện Thương Hiệu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8">
              <div className="space-y-3 sm:space-y-6">
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-6 rounded-lg border-l-4 border-luxury-gold">
                  <h3 className="font-luxury text-sm sm:text-xl font-bold text-luxury-gold mb-1 sm:mb-3">
                    Khởi Nguồn (2004)
                  </h3>
                  <p className="text-soft-gold text-2xs sm:text-base leading-relaxed">
                    Khang Trầm Hương được thành lập bởi nghệ nhân Nguyễn Văn Khang với niềm đam mê sâu sắc dành cho trầm hương. 
                    Bắt đầu từ một xưởng nhỏ tại Nha Trang, chúng tôi đã dành 20 năm qua để nghiên cứu và hoàn thiện nghệ thuật chế tác trầm hương.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-6 rounded-lg border-l-4 border-luxury-gold">
                  <h3 className="font-luxury text-sm sm:text-xl font-bold text-luxury-gold mb-1 sm:mb-3">
                    Phát Triển (2010-2020)
                  </h3>
                  <p className="text-soft-gold text-2xs sm:text-base leading-relaxed">
                    Thập kỷ vàng với việc mở rộng quy mô sản xuất và phát triển mạng lưới phân phối. 
                    Chúng tôi đã thiết lập các tiêu chuẩn chất lượng nghiêm ngặt và xây dựng đội ngũ nghệ nhân chuyên nghiệp.
                  </p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-6">
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-6 rounded-lg border-l-4 border-luxury-gold">
                  <h3 className="font-luxury text-sm sm:text-xl font-bold text-luxury-gold mb-1 sm:mb-3">
                    Hiện Tại (2024)
                  </h3>
                  <p className="text-soft-gold text-2xs sm:text-base leading-relaxed">
                    Khang Trầm Hương hiện là thương hiệu trầm hương cao cấp hàng đầu Việt Nam, 
                    phục vụ hơn 50,000 khách hàng trên toàn quốc với cam kết chất lượng và dịch vụ xuất sắc.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-3 sm:p-6 rounded-lg border-l-4 border-luxury-gold">
                  <h3 className="font-luxury text-sm sm:text-xl font-bold text-luxury-gold mb-1 sm:mb-3">
                    Tương Lai
                  </h3>
                  <p className="text-soft-gold text-2xs sm:text-base leading-relaxed">
                    Chúng tôi hướng tới việc mở rộng ra thị trường quốc tế, 
                    đưa tinh hoa trầm hương Việt Nam đến với bạn bè trên khắp thế giới.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-deep-black/50 rounded-xl p-3 sm:p-6 md:p-8 border border-luxury-gold/20">
            <div className="text-center mb-3 sm:mb-6">
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <span className="text-lg sm:text-3xl">🎯</span>
              </div>
              <h3 className="font-luxury text-base sm:text-xl md:text-2xl font-bold text-luxury-gold mb-1 sm:mb-3">
                Tầm Nhìn
              </h3>
            </div>
            <p className="text-soft-gold text-2xs sm:text-base leading-relaxed text-center">
              Trở thành thương hiệu trầm hương cao cấp được tin tưởng nhất Việt Nam, 
              mang tinh hoa văn hóa truyền thống đến với cộng đồng yêu trầm hương trên toàn thế giới.
            </p>
          </div>
          <div className="bg-deep-black/50 rounded-xl p-3 sm:p-6 md:p-8 border border-luxury-gold/20">
            <div className="text-center mb-3 sm:mb-6">
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <span className="text-lg sm:text-3xl">💎</span>
              </div>
              <h3 className="font-luxury text-base sm:text-xl md:text-2xl font-bold text-luxury-gold mb-1 sm:mb-3">
                Sứ Mệnh
              </h3>
            </div>
            <p className="text-soft-gold text-2xs sm:text-base leading-relaxed text-center">
              Cung cấp những sản phẩm trầm hương chất lượng cao nhất, 
              bảo tồn và phát huy giá trị văn hóa truyền thống, 
              mang lại sự thư thái và bình an cho cuộc sống.
            </p>
          </div>
        </div>

        {/* Products Section - Compact Grid */}
        <div className="mb-4 sm:mb-8">
          <div className="bg-deep-black/50 rounded-xl p-3 sm:p-6 md:p-8 border border-luxury-gold/20">
            <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-3 sm:mb-6 text-center">
              Sản Phẩm Nổi Bật
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-4 rounded-lg border border-luxury-gold/20">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                    <span className="text-sm sm:text-lg">🌿</span>
                  </div>
                  <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                    Trầm Bột Cao Cấp
                  </h3>
                  <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                    Được nghiền từ trầm hương nguyên chất, mang lại hương thơm tinh tế và lâu phai.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-4 rounded-lg border border-luxury-gold/20">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                    <span className="text-sm sm:text-lg">🔥</span>
                  </div>
                  <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                    Nhang Trầm Thủ Công
                  </h3>
                  <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                    Được làm hoàn toàn bằng tay theo phương pháp truyền thống, cháy đều và không khói.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-4 rounded-lg border border-luxury-gold/20">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                    <span className="text-sm sm:text-lg">💍</span>
                  </div>
                  <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                    Vòng Tay Trầm Hương
                  </h3>
                  <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                    Được chế tác từ những viên trầm hương tự nhiên, mang lại may mắn và bình an.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-4 rounded-lg border border-luxury-gold/20">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                    <span className="text-sm sm:text-lg">🏺</span>
                  </div>
                  <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                    Trầm Khối Nguyên Chất
                  </h3>
                  <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                    Những khối trầm hương tự nhiên được tuyển chọn kỹ lưỡng, thích hợp cho sưu tầm.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-2 sm:p-4 rounded-lg border border-luxury-gold/20 col-span-2 sm:col-span-1">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                    <span className="text-sm sm:text-lg">🎁</span>
                  </div>
                  <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                    Bộ Sưu Tập Luxury
                  </h3>
                  <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                    Các bộ sưu tập cao cấp được thiết kế riêng cho những người sành điệu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section - Compact */}
        <div className="mb-4 sm:mb-8">
          <div className="bg-deep-black/50 rounded-xl p-3 sm:p-6 md:p-8 border border-luxury-gold/20">
            <h2 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-3 sm:mb-6 text-center">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm">🌟</span>
                  </div>
                  <div>
                    <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                      Chất Lượng
                    </h3>
                    <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                      Chúng tôi cam kết mang đến những sản phẩm trầm hương chất lượng cao nhất, 
                      được kiểm định nghiêm ngặt theo tiêu chuẩn quốc tế.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                      Tín Nhiệm
                    </h3>
                    <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                      Sự tin tưởng của khách hàng là tài sản quý giá nhất. 
                      Chúng tôi luôn đặt uy tín và lòng tin lên hàng đầu.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm">🎨</span>
                  </div>
                  <div>
                    <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                      Nghệ Thuật
                    </h3>
                    <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                      Mỗi sản phẩm được tạo ra với tâm huyết và kỹ thuật của những nghệ nhân tài hoa, 
                      thể hiện tinh thần nghệ thuật truyền thống.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm">🌱</span>
                  </div>
                  <div>
                    <h3 className="font-luxury text-xs sm:text-base font-bold text-luxury-gold mb-1">
                      Bền Vững
                    </h3>
                    <p className="text-soft-gold text-3xs sm:text-xs leading-relaxed">
                      Chúng tôi cam kết bảo vệ môi trường và phát triển bền vững, 
                      góp phần bảo tồn tài nguyên thiên nhiên quý giá.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA - Compact */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 rounded-xl p-3 sm:p-6 md:p-8 border border-luxury-gold/20">
            <h2 className="font-luxury text-base sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-2 sm:mb-4">
              Kết Nối Với Chúng Tôi
            </h2>
            <p className="text-soft-gold text-2xs sm:text-base mb-3 sm:mb-6 max-w-2xl mx-auto">
              Hãy để chúng tôi đồng hành cùng bạn trong hành trình khám phá thế giới trầm hương đầy màu sắc
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <button className="bg-luxury-gold text-deep-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold hover:bg-luxury-copper transition-colors text-xs sm:text-base">
                Liên Hệ Ngay
              </button>
              <button className="border border-luxury-gold text-luxury-gold px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold hover:bg-luxury-gold hover:text-deep-black transition-colors text-xs sm:text-base">
                Xem Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;