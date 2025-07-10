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
  
  // New filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [minRating, setMinRating] = useState('');

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

    // Apply price filter
    if (minPrice) {
      result = result.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Apply brand filter
    if (brandFilter) {
      result = result.filter(product => 
        product.brand && product.brand.toLowerCase().includes(brandFilter.toLowerCase())
      );
    }

    // Apply rating filter
    if (minRating) {
      result = result.filter(product => 
        product.rating >= parseFloat(minRating)
      );
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
  }, [products, searchTerm, selectedCategory, sortBy, showFeaturedOnly, minPrice, maxPrice, brandFilter, minRating]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('featured');
    setShowFeaturedOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setBrandFilter('');
    setMinRating('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm || sortBy !== 'featured' || showFeaturedOnly || minPrice || maxPrice || brandFilter || minRating;

  if (loading) {
    return (
      <div className="container mx-auto px-2 py-4 pt-16">
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
      <div className="container mx-auto px-2 py-4 pt-16">
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
    <div className="container mx-auto px-2 py-4 pt-16">
      {/* Compact Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-luxury-gold mb-2">Sản Phẩm</h1>
        <p className="text-gray-300 text-xs">Khám phá bộ sưu tập trầm hương cao cấp</p>
      </div>

      {/* Enhanced Filters - With More Input Fields */}
      <div className="mb-4">
        {/* User-Friendly Filter Bar */}
        <div className="sticky top-16 z-10 bg-gradient-to-r from-deep-black/95 to-deep-black/90 backdrop-blur-sm border border-luxury-gold/20 rounded-lg p-3 mb-3 shadow-lg">
          
          {/* Filter Labels for Better UX */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-luxury-gold font-medium">
            <div>🔍 Tìm kiếm</div>
            <div>📂 Danh mục</div>
            <div>💰 Khoảng giá</div>
            <div>🏷️ Thương hiệu</div>
            <div>🔄 Sắp xếp</div>
            <div>⭐ Đánh giá</div>
          </div>
          
          {/* Mobile First Layout - 6 Fields */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            
            {/* Enhanced Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <IonIcon icon="search-outline" size={14} color="#D4AF37" />
              </div>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={searchTerm}
                className="w-full pl-8 pr-2 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 text-xs"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {/* Enhanced Category Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <IonIcon icon="grid-outline" size={14} color="#D4AF37" />
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 appearance-none cursor-pointer text-xs"
              >
                <option value="all">🏷️ Tất cả loại</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-deep-black text-white">📦 {category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <IonIcon icon="chevron-down-outline" size={12} color="#D4AF37" />
              </div>
            </div>

            {/* Min Price Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <IonIcon icon="pricetag-outline" size={14} color="#D4AF37" />
              </div>
              <input
                type="number"
                placeholder="Giá từ..."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 text-xs"
              />
            </div>

            {/* Max Price Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <IonIcon icon="pricetags-outline" size={14} color="#D4AF37" />
              </div>
              <input
                type="number"
                placeholder="Giá đến..."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 text-xs"
              />
            </div>

            {/* Brand Filter Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <IonIcon icon="business-outline" size={14} color="#D4AF37" />
              </div>
              <input
                type="text"
                placeholder="Thương hiệu..."
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 text-xs"
              />
            </div>

            {/* Rating Filter Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <IonIcon icon="star-outline" size={14} color="#D4AF37" />
              </div>
              <input
                type="number"
                placeholder="Đánh giá từ..."
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                min="1"
                max="5"
                step="0.1"
                className="w-full pl-8 pr-2 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 text-xs"
              />
            </div>
          </div>

          {/* Second Row - Sort & Featured */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {/* Enhanced Sort */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <IonIcon icon="funnel-outline" size={14} color="#D4AF37" />
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300 hover:border-luxury-gold/50 appearance-none cursor-pointer text-xs"
              >
                <option value="featured" className="bg-deep-black text-white">🔥 Nổi bật nhất</option>
                <option value="price-low" className="bg-deep-black text-white">💰 Giá thấp → cao</option>
                <option value="price-high" className="bg-deep-black text-white">💎 Giá cao → thấp</option>
                <option value="name" className="bg-deep-black text-white">🔤 Tên A → Z</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <IonIcon icon="chevron-down-outline" size={12} color="#D4AF37" />
              </div>
            </div>

            {/* Enhanced Featured Toggle */}
            <div className="relative group">
              <label className="flex items-center space-x-2 px-2 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg cursor-pointer hover:border-luxury-gold/50 transition-all duration-300 hover:bg-gradient-to-r hover:from-luxury-gold/10 hover:to-luxury-gold/5">
                <div className="relative">
                  <input 
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-all duration-300 ${
                    showFeaturedOnly 
                      ? 'bg-luxury-gold border-luxury-gold' 
                      : 'border-white/40 hover:border-luxury-gold/70'
                  }`}>
                    {showFeaturedOnly && (
                      <IonIcon icon="checkmark-outline" size={10} color="#1a1a1a" />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <IonIcon icon="star-outline" size={14} color="#D4AF37" />
                  <span className="text-white text-xs">Chỉ nổi bật</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Enhanced Clear Filters with Better Messaging */}
        {hasActiveFilters && (
          <div className="text-center mb-2">
            <button
              onClick={clearFilters}
              className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full text-red-300 hover:text-red-200 hover:border-red-400/50 transition-all duration-300 text-xs font-medium"
            >
              <IonIcon icon="close-circle-outline" size={12} color="#fca5a5" />
              <span>🗑️ Xóa bộ lọc ({
                [selectedCategory !== 'all', searchTerm, sortBy !== 'featured', showFeaturedOnly, minPrice, maxPrice, brandFilter, minRating].filter(Boolean).length
              })</span>
            </button>
          </div>
        )}
      </div>

      {/* Compact Results Header */}
      <div className="mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 bg-gradient-to-r from-deep-black/40 to-deep-black/20 rounded-lg border border-luxury-gold/10">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
              <IonIcon icon="bag-outline" size={10} color="#1a1a1a" />
            </div>
            <div>
              <p className="text-white text-xs font-medium">
                {filteredProducts.length > 0 ? (
                  <>
                    <span className="text-luxury-gold font-bold">{filteredProducts.length}</span> sản phẩm
                  </>
                ) : (
                  <span className="text-gray-400">Không có sản phẩm</span>
                )}
              </p>
              {searchTerm && (
                <p className="text-xs text-gray-400">
                  "<span className="text-luxury-gold">{searchTerm}</span>"
                </p>
              )}
            </div>
          </div>
          
          {/* Compact Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs text-gray-400">Lọc:</span>
              {selectedCategory !== 'all' && (
                <span className="px-1.5 py-0.5 bg-luxury-gold/20 text-luxury-gold rounded-full text-xs border border-luxury-gold/30">
                  {selectedCategory}
                </span>
              )}
              {sortBy !== 'featured' && (
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                  {sortBy === 'price-low' ? 'Giá thấp' : sortBy === 'price-high' ? 'Giá cao' : 'A-Z'}
                </span>
              )}
              {showFeaturedOnly && (
                <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs border border-yellow-500/30 flex items-center space-x-0.5">
                  <IonIcon icon="star" size={8} color="#fcd34d" />
                  <span>Nổi bật</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="max-w-sm mx-auto">
            <div className="w-12 h-12 bg-gradient-to-r from-luxury-gold/20 to-luxury-copper/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <IonIcon icon="search-outline" size={18} color="#D4AF37" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-400 mb-3 text-xs">
              {searchTerm ? (
                <>Không có sản phẩm phù hợp "<span className="text-luxury-gold">{searchTerm}</span>"</>
              ) : (
                <>Thử điều chỉnh bộ lọc</>
              )}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black font-bold rounded-full hover:from-luxury-copper hover:to-luxury-gold transition-all duration-300 text-xs"
              >
                <IonIcon icon="refresh-outline" size={10} color="#1a1a1a" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;