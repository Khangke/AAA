import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import cachedAPI from '../services/api';
import { debounce } from '../utils/cacheManager';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await cachedAPI.getAllProducts();
      setProducts(response);
      setFilteredProducts(response);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await cachedAPI.getCategories();
      setCategories(response.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback: extract categories from products
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by featured
    if (showFeaturedOnly) {
      filtered = filtered.filter(product => product.featured);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy, showFeaturedOnly]);

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    // Navigate to product detail page
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('featured');
    setShowFeaturedOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-deep-black mobile-nav-padding">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gray-800 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-96 animate-pulse"></div>
          </div>
          
          {/* Filters skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
          
          {/* Products grid skeleton */}
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-deep-black to-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h2 className="font-luxury text-2xl text-luxury-gold mb-4">
              Có Lỗi Xảy Ra
            </h2>
            <p className="text-soft-gold mb-6">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-luxury-gold text-deep-black px-6 py-3 rounded-full font-bold hover:bg-luxury-copper transition-colors"
            >
              Thử Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-deep-black mobile-nav-padding">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="font-luxury text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-luxury-gold mb-2 sm:mb-4">
            Sản Phẩm Trầm Hương
          </h1>
          <p className="text-soft-gold text-sm sm:text-base">
            Khám phá bộ sưu tập trầm hương cao cấp từ Việt Nam
          </p>
        </div>

        {/* Search Bar - Smaller for mobile */}
        <div className="mb-3 sm:mb-4">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 pl-9 sm:pl-12 bg-deep-black/50 border border-luxury-gold/20 rounded-full text-white placeholder-soft-gold focus:outline-none focus:border-luxury-gold/60 transition-colors text-sm sm:text-base"
            />
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-luxury-gold text-sm sm:text-base">
              🔍
            </div>
          </div>
        </div>

        {/* Filters - More compact for mobile */}
        <div className="mb-3 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 justify-center items-center">
            
            {/* Mobile: Stack filters vertically */}
            <div className="w-full sm:w-auto flex items-center gap-2 justify-center">
              <label className="text-soft-gold text-xs sm:text-sm whitespace-nowrap">Danh mục:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 sm:flex-none px-2 py-1 sm:px-3 sm:py-2 bg-deep-black/50 border border-luxury-gold/20 rounded-lg text-white focus:outline-none focus:border-luxury-gold/60 text-xs sm:text-sm"
              >
                <option value="all">Tất cả</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2 justify-center">
              <label className="text-soft-gold text-xs sm:text-sm whitespace-nowrap">Sắp xếp:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-2 py-1 sm:px-3 sm:py-2 bg-deep-black/50 border border-luxury-gold/20 rounded-lg text-white focus:outline-none focus:border-luxury-gold/60 text-xs sm:text-sm"
              >
                <option value="featured">Nổi bật</option>
                <option value="price-low">Giá thấp → cao</option>
                <option value="price-high">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="w-full sm:w-auto flex items-center justify-center gap-2">
              <label className="text-soft-gold text-xs sm:text-sm flex items-center">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="mr-1 sm:mr-2"
                />
                Chỉ sản phẩm nổi bật
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="text-luxury-gold hover:text-luxury-copper transition-colors text-xs sm:text-sm underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Results Count - More compact */}
        <div className="mb-2 sm:mb-4 text-center">
          <p className="text-soft-gold text-xs sm:text-sm">
            Hiển thị {filteredProducts.length} sản phẩm
            {selectedCategory !== 'all' && ` trong danh mục "${selectedCategory}"`}
          </p>
        </div>

        {/* Products Grid - Optimized for mobile with tighter spacing */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3 md:gap-4">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={handleProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-soft-gold text-4xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
            <h3 className="font-luxury text-lg sm:text-xl text-luxury-gold mb-2 sm:mb-4">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-soft-gold mb-4 sm:mb-6 text-sm sm:text-base">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
              onClick={clearFilters}
              className="bg-luxury-gold text-deep-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold hover:bg-luxury-copper transition-colors text-sm sm:text-base"
            >
              Xóa Bộ Lọc
            </button>
          </div>
        )}

        {/* Load More Button - For future pagination */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <button 
              className="bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-2 sm:px-8 sm:py-3 rounded-full font-bold hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              onClick={() => {
                // Pagination logic here
                console.log('Load more products');
              }}
            >
              Xem Thêm Sản Phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;