import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-deep-black to-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-luxury-gold mb-3 sm:mb-4">
            Về Khang Trầm Hương
          </h1>
          <p className="text-soft-gold text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Câu chuyện về hành trình 20 năm phát triển và tạo dựng thương hiệu trầm hương cao cấp
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-8 sm:mb-12">
          <div className="relative h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1639390167093-9c62311fe84d"
              alt="Khang Trầm Hương"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <h2 className="font-luxury text-lg sm:text-xl md:text-2xl font-bold text-luxury-gold mb-2">
                Trầm Hương Cao Cấp
              </h2>
              <p className="text-soft-gold text-xs sm:text-sm md:text-base">
                Tinh hoa từ thiên nhiên, tạo nên giá trị vĩnh cửu
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-deep-black/50 rounded-2xl p-4 sm:p-6 md:p-8 border border-luxury-gold/20">
            <h2 className="font-luxury text-xl sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-4 sm:mb-6 text-center">
              Câu Chuyện Thương Hiệu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-4 sm:p-6 rounded-xl border-l-4 border-luxury-gold">
                  <h3 className="font-luxury text-lg sm:text-xl font-bold text-luxury-gold mb-2 sm:mb-3">
                    Khởi Nguồn (2004)
                  </h3>
                  <p className="text-soft-gold text-sm sm:text-base leading-relaxed">
                    Khang Trầm Hương được thành lập bởi nghệ nhân Nguyễn Văn Khang với niềm đam mê sâu sắc dành cho trầm hương. 
                    Bắt đầu từ một xưởng nhỏ tại Nha Trang, chúng tôi đã dành 20 năm qua để nghiên cứu và hoàn thiện nghệ thuật chế tác trầm hương.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-4 sm:p-6 rounded-xl border-l-4 border-luxury-gold">
                  <h3 className="font-luxury text-lg sm:text-xl font-bold text-luxury-gold mb-2 sm:mb-3">
                    Phát Triển (2010-2020)
                  </h3>
                  <p className="text-soft-gold text-sm sm:text-base leading-relaxed">
                    Thập kỷ vàng với việc mở rộng quy mô sản xuất và phát triển mạng lưới phân phối. 
                    Chúng tôi đã thiết lập các tiêu chuẩn chất lượng nghiêm ngặt và xây dựng đội ngũ nghệ nhân chuyên nghiệp.
                  </p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-4 sm:p-6 rounded-xl border-l-4 border-luxury-gold">
                  <h3 className="font-luxury text-lg sm:text-xl font-bold text-luxury-gold mb-2 sm:mb-3">
                    Hiện Tại (2024)
                  </h3>
                  <p className="text-soft-gold text-sm sm:text-base leading-relaxed">
                    Khang Trầm Hương hiện là thương hiệu trầm hương cao cấp hàng đầu Việt Nam, 
                    phục vụ hơn 50,000 khách hàng trên toàn quốc với cam kết chất lượng và dịch vụ xuất sắc.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-luxury-gold/10 to-transparent p-4 sm:p-6 rounded-xl border-l-4 border-luxury-gold">
                  <h3 className="font-luxury text-lg sm:text-xl font-bold text-luxury-gold mb-2 sm:mb-3">
                    Tương Lai
                  </h3>
                  <p className="text-soft-gold text-sm sm:text-base leading-relaxed">
                    Chúng tôi hướng tới việc mở rộng ra thị trường quốc tế, 
                    đưa tinh hoa trầm hương Việt Nam đến với bạn bè trên khắp thế giới.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-deep-black/50 rounded-2xl p-4 sm:p-6 md:p-8 border border-luxury-gold/20">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">🎯</span>
              </div>
              <h3 className="font-luxury text-lg sm:text-xl md:text-2xl font-bold text-luxury-gold mb-2 sm:mb-3">
                Tầm Nhìn
              </h3>
            </div>
            <p className="text-soft-gold text-sm sm:text-base leading-relaxed text-center">
              Trở thành thương hiệu trầm hương cao cấp được tin tưởng nhất Việt Nam, 
              mang tinh hoa văn hóa truyền thống đến với cộng đồng yêu trầm hương trên toàn thế giới.
            </p>
          </div>
          <div className="bg-deep-black/50 rounded-2xl p-4 sm:p-6 md:p-8 border border-luxury-gold/20">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">💎</span>
              </div>
              <h3 className="font-luxury text-lg sm:text-xl md:text-2xl font-bold text-luxury-gold mb-2 sm:mb-3">
                Sứ Mệnh
              </h3>
            </div>
            <p className="text-soft-gold text-sm sm:text-base leading-relaxed text-center">
              Cung cấp những sản phẩm trầm hương chất lượng cao nhất, 
              bảo tồn và phát huy giá trị văn hóa truyền thống, 
              mang lại sự thư thái và bình an cho cuộc sống.
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-deep-black/50 rounded-2xl p-4 sm:p-6 md:p-8 border border-luxury-gold/20">
            <h2 className="font-luxury text-xl sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-6 sm:mb-8 text-center">
              Sản Phẩm Nổi Bật
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-4 sm:p-6 rounded-xl border border-luxury-gold/20">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl">🌿</span>
                  </div>
                  <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
                    Trầm Bột Cao Cấp
                  </h3>
                </div>
                <p className="text-soft-gold text-xs sm:text-sm leading-relaxed text-center">
                  Được nghiền từ trầm hương nguyên chất, mang lại hương thơm tinh tế và lâu phai.
                </p>
              </div>
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-4 sm:p-6 rounded-xl border border-luxury-gold/20">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl">🔥</span>
                  </div>
                  <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
                    Nhang Trầm Thủ Công
                  </h3>
                </div>
                <p className="text-soft-gold text-xs sm:text-sm leading-relaxed text-center">
                  Được làm hoàn toàn bằng tay theo phương pháp truyền thống, cháy đều và không khói.
                </p>
              </div>
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-4 sm:p-6 rounded-xl border border-luxury-gold/20">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl">💍</span>
                  </div>
                  <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
                    Vòng Tay Trầm Hương
                  </h3>
                </div>
                <p className="text-soft-gold text-xs sm:text-sm leading-relaxed text-center">
                  Được chế tác từ những viên trầm hương tự nhiên, mang lại may mắn và bình an.
                </p>
              </div>
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-4 sm:p-6 rounded-xl border border-luxury-gold/20">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl">🏺</span>
                  </div>
                  <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
                    Trầm Khối Nguyên Chất
                  </h3>
                </div>
                <p className="text-soft-gold text-xs sm:text-sm leading-relaxed text-center">
                  Những khối trầm hương tự nhiên được tuyển chọn kỹ lưỡng, thích hợp cho sưu tầm.
                </p>
              </div>
              <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-copper/10 p-4 sm:p-6 rounded-xl border border-luxury-gold/20">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl">🎁</span>
                  </div>
                  <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
                    Bộ Sưu Tập Luxury
                  </h3>
                </div>
                <p className="text-soft-gold text-xs sm:text-sm leading-relaxed text-center">
                  Các bộ sưu tập cao cấp được thiết kế riêng cho những người sành điệu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-deep-black/50 rounded-2xl p-4 sm:p-6 md:p-8 border border-luxury-gold/20">
            <h2 className="font-luxury text-xl sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-6 sm:mb-8 text-center">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base">🌟</span>
                  </div>
                  <div>
                    <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold mb-1 sm:mb-2">
                      Chất Lượng
                    </h3>
                    <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                      Chúng tôi cam kết mang đến những sản phẩm trầm hương chất lượng cao nhất, 
                      được kiểm định nghiêm ngặt theo tiêu chuẩn quốc tế.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold mb-1 sm:mb-2">
                      Tín Nhiệm
                    </h3>
                    <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                      Sự tin tưởng của khách hàng là tài sản quý giá nhất. 
                      Chúng tôi luôn đặt uy tín và lòng tin lên hàng đầu.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base">🎨</span>
                  </div>
                  <div>
                    <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold mb-1 sm:mb-2">
                      Nghệ Thuật
                    </h3>
                    <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                      Mỗi sản phẩm được tạo ra với tâm huyết và kỹ thuật của những nghệ nhân tài hoa, 
                      thể hiện tinh thần nghệ thuật truyền thống.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base">🌱</span>
                  </div>
                  <div>
                    <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold mb-1 sm:mb-2">
                      Bền Vững
                    </h3>
                    <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                      Chúng tôi cam kết bảo vệ môi trường và phát triển bền vững, 
                      góp phần bảo tồn tài nguyên thiên nhiên quý giá.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-luxury-gold/20">
            <h2 className="font-luxury text-xl sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-3 sm:mb-4">
              Kết Nối Với Chúng Tôi
            </h2>
            <p className="text-soft-gold text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto">
              Hãy để chúng tôi đồng hành cùng bạn trong hành trình khám phá thế giới trầm hương đầy màu sắc
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-luxury-gold text-deep-black px-6 py-3 rounded-full font-bold hover:bg-luxury-copper transition-colors">
                Liên Hệ Ngay
              </button>
              <button className="border border-luxury-gold text-luxury-gold px-6 py-3 rounded-full font-bold hover:bg-luxury-gold hover:text-deep-black transition-colors">
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