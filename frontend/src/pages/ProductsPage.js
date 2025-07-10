import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import cachedAPI from '../services/api';
import { debounce } from '../utils/cacheManager';
import IonIcon from '../components/IonIcon';

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
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply featured filter
    if (showFeaturedOnly) {
      result = result.filter(product => product.is_featured);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => b.is_featured - a.is_featured);
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortBy, showFeaturedOnly]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('featured');
    setShowFeaturedOnly(false);
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm || sortBy !== 'featured' || showFeaturedOnly;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-luxury-gold mb-4">Sản Phẩm</h1>
          <p className="text-gray-300">Đang tải sản phẩm...</p>
        </div>
        <ProductGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-luxury-gold mb-4">Sản Phẩm</h1>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-luxury-gold text-deep-black px-6 py-3 rounded-full font-bold hover:bg-luxury-copper transition-colors flex items-center space-x-2"
            >
              <IonIcon icon="refresh-outline" size={20} color="#1a1a1a" />
              <span>Thử Lại</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-luxury-gold mb-4">Sản Phẩm</h1>
        <p className="text-gray-300">Khám phá bộ sưu tập trầm hương cao cấp</p>
      </div>

      {/* Enhanced Filters */}
      <div className="mb-8">
        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-10 bg-gradient-to-r from-deep-black/95 to-deep-black/90 backdrop-blur-sm border border-luxury-gold/20 rounded-xl p-4 mb-6 shadow-2xl">
          {/* Mobile First Layout */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
            
            {/* Enhanced Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IonIcon icon="search-outline" size={20} color="#D4AF37" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-luxury-gold/0 to-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Enhanced Category Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IonIcon icon="grid-outline" size={20} color="#D4AF37" />
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 appearance-none cursor-pointer"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-deep-black text-white">{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <IonIcon icon="chevron-down-outline" size={16} color="#D4AF37" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-luxury-gold/0 to-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Enhanced Sort */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IonIcon icon="funnel-outline" size={20} color="#D4AF37" />
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 appearance-none cursor-pointer"
              >
                <option value="featured" className="bg-deep-black text-white">Nổi bật</option>
                <option value="price-low" className="bg-deep-black text-white">Giá thấp đến cao</option>
                <option value="price-high" className="bg-deep-black text-white">Giá cao đến thấp</option>
                <option value="name" className="bg-deep-black text-white">Tên A-Z</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <IonIcon icon="chevron-down-outline" size={16} color="#D4AF37" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-luxury-gold/0 to-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Enhanced Featured Toggle */}
            <div className="relative group">
              <label className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl cursor-pointer hover:border-luxury-gold/50 transition-all duration-300 hover:bg-gradient-to-r hover:from-luxury-gold/10 hover:to-luxury-gold/5">
                <div className="relative">
                  <input 
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 ${
                    showFeaturedOnly 
                      ? 'bg-luxury-gold border-luxury-gold' 
                      : 'border-white/40 hover:border-luxury-gold/70'
                  }`}>
                    {showFeaturedOnly && (
                      <IonIcon icon="checkmark-outline" size={14} color="#1a1a1a" />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <IonIcon icon="star-outline" size={18} color="#D4AF37" />
                  <span className="text-white text-sm font-medium">Sản phẩm nổi bật</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Enhanced Clear Filters */}
        {hasActiveFilters && (
          <div className="text-center mb-4">
            <button
              onClick={clearFilters}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full text-red-300 hover:text-red-200 hover:border-red-400/50 transition-all duration-300 text-sm font-medium"
            >
              <IonIcon icon="close-circle-outline" size={16} color="#fca5a5" />
              <span>Xóa tất cả bộ lọc</span>
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-300 text-sm">
          Hiển thị {filteredProducts.length} sản phẩm
          {searchTerm && (
            <span className="text-luxury-gold"> cho "{searchTerm}"</span>
          )}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-sm text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;