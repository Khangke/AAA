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

      {/* Filters */}
      <div className="mb-8">
        <div className="bg-deep-black/50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold transition-colors"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-luxury-gold transition-colors"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-luxury-gold transition-colors"
              >
                <option value="featured">Nổi bật</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div>
              <label className="flex items-center space-x-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                <input 
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="accent-luxury-gold"
                />
                <span className="text-white text-sm">Chỉ sản phẩm nổi bật</span>
              </label>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="text-center">
            <button
              onClick={clearFilters}
              className="text-luxury-gold hover:text-luxury-copper transition-colors text-xs sm:text-sm underline flex items-center space-x-1"
            >
              <IonIcon icon="close-outline" size={14} />
              <span>Xóa bộ lọc</span>
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