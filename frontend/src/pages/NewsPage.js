import React, { useState } from 'react';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    { id: 'all', name: 'Tất Cả', icon: '📰' },
    { id: 'knowledge', name: 'Kiến Thức', icon: '📚' },
    { id: 'products', name: 'Sản Phẩm', icon: '🛍️' },
    { id: 'events', name: 'Sự Kiện', icon: '🎉' },
    { id: 'tips', name: 'Mẹo Hay', icon: '💡' },
  ];

  const articles = [
    {
      id: 1,
      title: "Cách Nhận Biết Trầm Hương Thật Và Giả",
      excerpt: "Hướng dẫn chi tiết cách phân biệt trầm hương thật với hàng giả trên thị trường...",
      content: "Trầm hương thật có mùi hương đặc trưng, không gắt, không chói. Khi đốt, khói trầm hương thật có màu trắng hoặc xanh nhạt, bay thẳng và không có mùi khó chịu. Trầm hương giả thường có mùi hương nhân tạo, khi đốt tạo ra khói đen và mùi hăng. Ngoài ra, trầm hương thật thường có trọng lượng nặng hơn và có độ dẻo tự nhiên.",
      category: 'knowledge',
      date: '2024-01-15',
      author: 'Thầy Khang',
      image: 'https://images.unsplash.com/photo-1541795083-1b160cf4f3d7',
      readTime: '5 phút',
      featured: true
    },
    {
      id: 2,
      title: "Bộ Sưu Tập Trầm Hương Cao Cấp Mới Nhất",
      excerpt: "Khám phá bộ sưu tập trầm hương cao cấp với thiết kế độc đáo và chất lượng vượt trội...",
      content: "Bộ sưu tập mới bao gồm 10 sản phẩm đặc biệt được chế tác từ trầm hương Nha Trang nguyên chất. Mỗi sản phẩm đều có giấy chứng nhận chất lượng và được đóng gói trong hộp gỗ sang trọng. Đặc biệt, bộ sưu tập này có phiên bản giới hạn chỉ 100 bộ trên toàn quốc.",
      category: 'products',
      date: '2024-01-10',
      author: 'Khang Trầm Hương',
      image: 'https://images.pexels.com/photos/3639806/pexels-photo-3639806.jpeg',
      readTime: '3 phút',
      featured: false
    },
    {
      id: 3,
      title: "Nghệ Thuật Thiền Với Trầm Hương",
      excerpt: "Hướng dẫn cách sử dụng trầm hương trong thiền định để đạt được sự thư thái tâm hồn...",
      content: "Trầm hương đã được sử dụng trong thiền định hàng ngàn năm. Mùi hương của trầm giúp tâm trí thư thái, tập trung và đạt được trạng thái định tĩnh. Khi thiền với trầm hương, hãy ngồi ở tư thế thoải mái, thắp trầm và tập trung vào hơi thở. Mùi hương sẽ giúp bạn dễ dàng đi vào trạng thái thiền sâu.",
      category: 'tips',
      date: '2024-01-08',
      author: 'Thầy Minh',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      readTime: '7 phút',
      featured: true
    },
    {
      id: 4,
      title: "Sự Kiện Triển Lãm Trầm Hương Quốc Tế",
      excerpt: "Khang Trầm Hương tham gia triển lãm quốc tế tại TP.HCM với nhiều sản phẩm độc đáo...",
      content: "Triển lãm diễn ra từ ngày 20-25/1/2024 tại Trung tâm Hội chợ Triển lãm Sài Gòn. Khang Trầm Hương sẽ trưng bày hơn 100 sản phẩm trầm hương cao cấp, bao gồm cả những sản phẩm mới chưa từng được giới thiệu. Đặc biệt, có chương trình giảm giá đặc biệt cho khách hàng tham quan.",
      category: 'events',
      date: '2024-01-05',
      author: 'Ban Tổ Chức',
      image: 'https://images.pexels.com/photos/668353/pexels-photo-668353.jpeg',
      readTime: '4 phút',
      featured: false
    },
    {
      id: 5,
      title: "Cách Bảo Quản Trầm Hương Đúng Cách",
      excerpt: "Bí quyết bảo quản trầm hương để giữ nguyên hương thơm và chất lượng qua thời gian...",
      content: "Trầm hương cần được bảo quản ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Nên để trong hộp gỗ hoặc túi vải thoáng khí. Tránh để cùng với các vật dụng có mùi mạnh. Định kỳ lấy ra phơi nắng nhẹ 15-20 phút để loại bỏ độ ẩm. Nếu bảo quản đúng cách, trầm hương có thể giữ được chất lượng trong nhiều năm.",
      category: 'tips',
      date: '2024-01-03',
      author: 'Chuyên Gia Trầm',
      image: 'https://images.unsplash.com/photo-1532009877282-3340270e0529',
      readTime: '6 phút',
      featured: false
    },
    {
      id: 6,
      title: "Lịch Sử Và Văn Hóa Trầm Hương Việt Nam",
      excerpt: "Tìm hiểu về lịch sử hình thành và phát triển của trầm hương trong văn hóa Việt Nam...",
      content: "Trầm hương đã có mặt ở Việt Nam từ hàng nghìn năm trước. Người Việt Nam cổ đại đã biết sử dụng trầm hương trong các nghi lễ tôn giáo, thiền định và y học cổ truyền. Vùng Nha Trang - Khánh Hòa được biết đến là nơi có trầm hương chất lượng cao nhất. Trầm hương Việt Nam đã được xuất khẩu sang nhiều nước trên thế giới.",
      category: 'knowledge',
      date: '2024-01-01',
      author: 'GS. Nguyễn Văn Sử',
      image: 'https://images.unsplash.com/photo-1639390167093-9c62311fe84d',
      readTime: '8 phút',
      featured: true
    }
  ];

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-deep-black to-charcoal">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-2 sm:mb-4 flex items-center text-luxury-gold hover:text-luxury-copper transition-colors"
          >
            <span className="mr-1">←</span>
            <span className="text-xs sm:text-sm">Quay lại</span>
          </button>

          {/* Article Content */}
          <article className="bg-deep-black/50 rounded-lg p-3 sm:p-6 border border-luxury-gold/20">
            <div className="mb-2 sm:mb-4">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-24 sm:h-40 md:h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="mb-2 sm:mb-4">
              <h1 className="font-luxury text-sm sm:text-xl md:text-2xl font-bold text-luxury-gold mb-1 sm:mb-2">
                {selectedArticle.title}
              </h1>
              <div className="flex flex-wrap items-center gap-1 text-3xs sm:text-xs text-soft-gold">
                <span>📅 {formatDate(selectedArticle.date)}</span>
                <span>•</span>
                <span>✍️ {selectedArticle.author}</span>
                <span>•</span>
                <span>⏱️ {selectedArticle.readTime}</span>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-soft-gold text-xs sm:text-sm leading-relaxed">
                {selectedArticle.content}
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-deep-black to-charcoal">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        
        {/* Header - Super Compact */}
        <div className="text-center mb-3 sm:mb-6">
          <h1 className="font-luxury text-lg sm:text-2xl md:text-3xl font-bold text-luxury-gold mb-1 sm:mb-2">
            Tin Tức Trầm Hương
          </h1>
          <p className="text-soft-gold text-xs sm:text-sm max-w-xl mx-auto">
            Cập nhật thông tin mới nhất về trầm hương
          </p>
        </div>

        {/* Categories - Very Compact */}
        <div className="mb-3 sm:mb-4">
          <div className="flex gap-1 justify-center overflow-x-auto pb-1">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-2 py-1 rounded-full text-3xs sm:text-xs font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-luxury-gold text-deep-black'
                    : 'bg-deep-black/50 text-soft-gold border border-luxury-gold/20'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Articles - Horizontal Scroll on Mobile */}
        {featuredArticles.length > 0 && (
          <div className="mb-3 sm:mb-6">
            <h2 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold mb-2 sm:mb-3">
              🌟 Nổi Bật
            </h2>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible">
              {featuredArticles.map(article => (
                <div
                  key={article.id}
                  className="bg-deep-black/50 rounded-lg overflow-hidden border border-luxury-gold/20 cursor-pointer group flex-shrink-0 w-48 sm:w-auto"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative h-20 sm:h-24 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-1 left-1 bg-luxury-gold text-deep-black px-1 py-0.5 rounded text-3xs font-bold">
                      HOT
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between text-3xs text-soft-gold/80">
                      <span>{formatDate(article.date)}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Articles - Compact List */}
        <div className="mb-3 sm:mb-6">
          <h2 className="font-luxury text-sm sm:text-lg font-bold text-luxury-gold mb-2 sm:mb-3">
            📰 Tất Cả Bài Viết ({filteredArticles.length})
          </h2>
          
          {/* List View for Mobile, Grid for Desktop */}
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
            {filteredArticles.map(article => (
              <div
                key={article.id}
                className="bg-deep-black/50 rounded-lg border border-luxury-gold/20 cursor-pointer group transition-all duration-300 hover:border-luxury-gold/40"
                onClick={() => setSelectedArticle(article)}
              >
                {/* Mobile: Horizontal Layout */}
                <div className="flex gap-2 sm:block p-2">
                  <div className="relative w-16 h-16 sm:w-full sm:h-20 flex-shrink-0 overflow-hidden rounded sm:rounded-b-none">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {article.featured && (
                      <div className="absolute top-0.5 left-0.5 bg-luxury-gold text-deep-black px-1 py-0.5 rounded text-3xs font-bold">
                        ⭐
                      </div>
                    )}
                    <div className="absolute top-0.5 right-0.5 bg-luxury-gold/90 text-deep-black px-1 py-0.5 rounded text-3xs font-bold">
                      {categories.find(cat => cat.id === article.category)?.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 sm:p-1">
                    <h3 className="font-luxury text-xs sm:text-sm font-bold text-luxury-gold mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-soft-gold text-3xs sm:text-xs mb-1 line-clamp-1 sm:line-clamp-2 hidden sm:block">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-3xs text-soft-gold/80">
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{formatDate(article.date)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{article.readTime}</span>
                      </span>
                    </div>
                    <div className="text-3xs text-soft-gold/60 mt-0.5">
                      ✍️ {article.author}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results - Super Compact */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-6">
            <div className="text-soft-gold text-2xl mb-2">📰</div>
            <h3 className="font-luxury text-sm text-luxury-gold mb-2">
              Không Tìm Thấy Bài Viết
            </h3>
            <button
              onClick={() => setActiveCategory('all')}
              className="bg-luxury-gold text-deep-black px-3 py-1 rounded-full font-bold hover:bg-luxury-copper transition-colors text-xs"
            >
              Xem Tất Cả
            </button>
          </div>
        )}

        {/* Newsletter - Compact */}
        <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 rounded-lg p-3 border border-luxury-gold/20 text-center">
          <h2 className="font-luxury text-sm sm:text-base font-bold text-luxury-gold mb-1 sm:mb-2">
            📬 Đăng Ký Nhận Tin
          </h2>
          <p className="text-soft-gold text-xs mb-2 sm:mb-3">
            Nhận thông tin mới nhất về trầm hương
          </p>
          <div className="flex gap-2 max-w-xs mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-2 py-1 bg-deep-black/50 border border-luxury-gold/20 rounded-full text-white placeholder-soft-gold focus:outline-none text-xs"
            />
            <button className="bg-luxury-gold text-deep-black px-3 py-1 rounded-full font-bold hover:bg-luxury-copper transition-colors text-xs">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;