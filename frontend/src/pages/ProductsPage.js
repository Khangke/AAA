import React from 'react';

const ProductsPage = () => {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="font-luxury text-3xl md:text-4xl font-bold text-luxury-gold mb-4">
            Sản Phẩm Trầm Hương Cao Cấp
          </h1>
          <p className="text-soft-gold text-lg max-w-2xl mx-auto">
            Khám phá bộ sưu tập trầm hương luxury được tuyển chọn kỹ lưỡng
          </p>
        </div>

        <div className="text-center py-20">
          <div className="text-luxury-gold text-6xl mb-6">🔄</div>
          <h2 className="font-luxury text-2xl text-luxury-gold mb-4">
            Đang Phát Triển
          </h2>
          <p className="text-soft-gold">
            Trang sản phẩm đang được hoàn thiện để mang đến trải nghiệm tốt nhất
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;