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
  
  // Simple filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

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
  }, [products, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm || sortBy !== 'featured';

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

      {/* Elegant Simple Filters */}
      <div className="mb-6">
        {/* Luxury Filter Container */}
        <div className="bg-gradient-to-br from-luxury-gold/10 via-deep-black/90 to-luxury-copper/10 backdrop-blur-xl border border-luxury-gold/30 rounded-2xl p-5 shadow-2xl">
          
          {/* Elegant Search Bar */}
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 to-luxury-copper/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="w-5 h-5 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
                  <IonIcon icon="search-outline" size={14} color="#1a1a1a" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm trầm hương cao cấp..."
                value={searchTerm}
                className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-white/5 to-white/10 border border-luxury-gold/40 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 transition-all duration-300 hover:border-luxury-gold/60 text-sm font-medium backdrop-blur-sm"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    debouncedSearch('');
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-luxury-gold hover:text-luxury-copper transition-colors"
                >
                  <IonIcon icon="close-circle-outline" size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Elegant Category & Sort Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Luxury Category Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-5 h-5 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
                    <IonIcon icon="apps-outline" size={14} color="#1a1a1a" />
                  </div>
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 bg-gradient-to-r from-white/5 to-white/10 border border-luxury-gold/40 rounded-xl text-white focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 transition-all duration-300 hover:border-luxury-gold/60 appearance-none cursor-pointer text-sm font-medium backdrop-blur-sm"
                >
                  <option value="all" className="bg-deep-black text-white">✨ Tất cả danh mục</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-deep-black text-white">
                      🎋 {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <div className="w-6 h-6 bg-gradient-to-r from-luxury-gold/30 to-luxury-copper/30 rounded-full flex items-center justify-center">
                    <IonIcon icon="chevron-down-outline" size={14} color="#D4AF37" />
                  </div>
                </div>
              </div>
            </div>

            {/* Luxury Sort Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/10 to-luxury-copper/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-5 h-5 bg-gradient-to-r from-luxury-gold to-luxury-copper rounded-full flex items-center justify-center">
                    <IonIcon icon="filter-outline" size={14} color="#1a1a1a" />
                  </div>
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 bg-gradient-to-r from-white/5 to-white/10 border border-luxury-gold/40 rounded-xl text-white focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 transition-all duration-300 hover:border-luxury-gold/60 appearance-none cursor-pointer text-sm font-medium backdrop-blur-sm"
                >
                  <option value="featured" className="bg-deep-black text-white">⭐ Sản phẩm nổi bật</option>
                  <option value="price-low" className="bg-deep-black text-white">💰 Giá từ thấp đến cao</option>
                  <option value="price-high" className="bg-deep-black text-white">💎 Giá từ cao đến thấp</option>
                  <option value="name" className="bg-deep-black text-white">🔤 Tên từ A đến Z</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <div className="w-6 h-6 bg-gradient-to-r from-luxury-gold/30 to-luxury-copper/30 rounded-full flex items-center justify-center">
                    <IonIcon icon="chevron-down-outline" size={14} color="#D4AF37" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-luxury-gold text-xs font-medium">Bộ lọc đang áp dụng:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-luxury-gold/20 to-luxury-copper/20 border border-luxury-gold/40 rounded-full text-luxury-gold text-xs font-medium">
                  🎋 {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 hover:text-luxury-copper transition-colors"
                  >
                    <IonIcon icon="close" size={12} />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/40 rounded-full text-blue-300 text-xs font-medium">
                  🔍 "{searchTerm}"
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      debouncedSearch('');
                    }}
                    className="ml-2 hover:text-blue-200 transition-colors"
                  >
                    <IonIcon icon="close" size={12} />
                  </button>
                </span>
              )}
              {sortBy !== 'featured' && (
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/40 rounded-full text-purple-300 text-xs font-medium">
                  🔄 {sortBy === 'price-low' ? 'Giá tăng dần' : sortBy === 'price-high' ? 'Giá giảm dần' : 'Tên A-Z'}
                  <button 
                    onClick={() => setSortBy('featured')}
                    className="ml-2 hover:text-purple-200 transition-colors"
                  >
                    <IonIcon icon="close" size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 rounded-full text-red-300 hover:text-red-200 hover:border-red-400/60 transition-all duration-300 text-xs font-medium ml-2"
              >
                <IonIcon icon="trash-outline" size={12} />
                <span className="ml-1">Xóa tất cả</span>
              </button>
            </div>
          )}
        </div>
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