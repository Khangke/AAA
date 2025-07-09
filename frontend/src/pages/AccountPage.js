import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import IconWrapper from '../components/IconWrapper';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AccountPage = () => {
  const { isAuthenticated, user, loading, login, register, logout, updateUser, error, clearError } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: ''
  });
  
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    zip_code: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Load user data into profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        district: user.district || '',
        ward: user.ward || '',
        zip_code: user.zip_code || ''
      });
      if (activeTab === 'profile') {
        loadOrders();
      }
    }
  }, [user, activeTab]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginForm.email) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!loginForm.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors = {};
    
    if (!registerForm.email) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!registerForm.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!registerForm.full_name) {
      errors.full_name = 'Vui lòng nhập họ và tên';
    }
    
    if (!registerForm.phone) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(registerForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsSubmitting(true);
    clearError();
    
    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      setActiveTab('profile');
      setLoginForm({ email: '', password: '' });
    }
    
    setIsSubmitting(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsSubmitting(true);
    clearError();
    
    const { confirmPassword, ...userData } = registerForm;
    const result = await register(userData);
    
    if (result.success) {
      setActiveTab('profile');
      setRegisterForm({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        phone: ''
      });
    }
    
    setIsSubmitting(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    const result = await updateUser(profileForm);
    
    if (result.success) {
      setEditingProfile(false);
      alert('Cập nhật thông tin thành công!');
    } else {
      alert(result.error || 'Có lỗi xảy ra khi cập nhật thông tin');
    }
    
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('login');
    setOrders([]);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-400',
      confirmed: 'text-blue-400',
      processing: 'text-purple-400',
      shipped: 'text-orange-400',
      delivered: 'text-green-400',
      cancelled: 'text-red-400'
    };
    return colors[status] || 'text-soft-gold';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return statusTexts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    return method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-deep-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-luxury-gold text-6xl mb-6 animate-pulse">👤</div>
            <h2 className="font-luxury text-2xl text-luxury-gold">
              Đang tải thông tin...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14 md:pt-20 bg-deep-black mobile-nav-padding">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="font-luxury text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-luxury-gold mb-2 sm:mb-4">
            {isAuthenticated ? 'Tài Khoản Của Tôi' : 'Đăng Nhập / Đăng Ký'}
          </h1>
          {isAuthenticated && user && (
            <p className="text-soft-gold text-sm sm:text-lg">
              Chào mừng trở lại, {user.full_name || user.email}!
            </p>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto">
            
            {/* Tab Navigation */}
            <div className="flex mb-6 sm:mb-8 bg-charcoal/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'login'
                    ? 'bg-luxury-gold text-deep-black'
                    : 'text-soft-gold hover:text-luxury-gold'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'register'
                    ? 'bg-luxury-gold text-deep-black'
                    : 'text-soft-gold hover:text-luxury-gold'
                }`}
              >
                Đăng Ký
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="login-email" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                      Email
                    </label>
                    <input
                      type="email"
                      id="login-email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base ${
                        formErrors.email ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                      }`}
                      placeholder="email@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                      Mật Khẩu
                    </label>
                    <input
                      type="password"
                      id="login-password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base ${
                        formErrors.password ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                      }`}
                      placeholder="Nhập mật khẩu"
                    />
                    {formErrors.password && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
                  </button>
                </form>
              </div>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="register-name" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        id="register-name"
                        value={registerForm.full_name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base ${
                          formErrors.full_name ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                        }`}
                        placeholder="Nhập họ và tên"
                      />
                      {formErrors.full_name && (
                        <p className="text-red-400 text-xs sm:text-sm mt-1">{formErrors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="register-phone" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        id="register-phone"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base ${
                          formErrors.phone ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                        }`}
                        placeholder="0123 456 789"
                      />
                      {formErrors.phone && (
                        <p className="text-red-400 text-xs sm:text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                <div>
                  <label htmlFor="register-email" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base ${
                      formErrors.email ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                    }`}
                    placeholder="email@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="register-password" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                      Mật Khẩu *
                    </label>
                    <input
                      type="password"
                      id="register-password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base ${
                        formErrors.password ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                      }`}
                      placeholder="Nhập mật khẩu"
                    />
                    {formErrors.password && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                      Xác Nhận Mật Khẩu *
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                      }`}
                      placeholder="Nhập lại mật khẩu"
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="bg-deep-black/30 border border-luxury-gold/20 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-soft-gold text-xs sm:text-sm">
                    <strong>📍 Lưu ý:</strong> Thông tin địa chỉ sẽ được thu thập khi bạn đặt đơn hàng đầu tiên
                  </p>
                </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Đang Đăng Ký...' : 'Đăng Ký'}
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* Authenticated User Dashboard */
          <div>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-6 sm:mb-8 bg-charcoal/50 rounded-lg p-1 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'profile'
                    ? 'bg-luxury-gold text-deep-black'
                    : 'text-soft-gold hover:text-luxury-gold'
                }`}
              >
                Thông Tin
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'orders'
                    ? 'bg-luxury-gold text-deep-black'
                    : 'text-soft-gold hover:text-luxury-gold'
                }`}
              >
                Đơn Hàng
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                    <h2 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-3 sm:mb-0">
                      Thông Tin Cá Nhân
                    </h2>
                    <div className="flex space-x-2 text-sm sm:text-base">
                      {!editingProfile ? (
                        <button
                          onClick={() => setEditingProfile(true)}
                          className="text-luxury-gold hover:text-luxury-copper transition-colors flex items-center space-x-1"
                        >
                          <IconWrapper icon="create-outline" size={16} />
                          <span>Chỉnh sửa</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingProfile(false)}
                          className="text-soft-gold hover:text-luxury-gold transition-colors flex items-center space-x-1"
                        >
                          <IconWrapper icon="close-outline" size={16} />
                          <span>Hủy</span>
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                      >
                        <IconWrapper icon="log-out-outline" size={16} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>

                  {!editingProfile ? (
                    /* Display Mode */
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Họ và Tên
                          </label>
                          <p className="text-soft-gold p-2.5 sm:p-3 bg-deep-black/50 rounded-lg text-sm sm:text-base">
                            {user?.full_name || 'Chưa cập nhật'}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Email
                          </label>
                          <p className="text-soft-gold p-2.5 sm:p-3 bg-deep-black/50 rounded-lg text-sm sm:text-base">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Số Điện Thoại
                          </label>
                          <p className="text-soft-gold p-2.5 sm:p-3 bg-deep-black/50 rounded-lg text-sm sm:text-base">
                            {user?.phone || 'Chưa cập nhật'}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Tỉnh/Thành
                          </label>
                          <p className="text-soft-gold p-2.5 sm:p-3 bg-deep-black/50 rounded-lg text-sm sm:text-base">
                            {user?.city || 'Chưa cập nhật'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                          Địa Chỉ Đầy Đủ
                        </label>
                        <p className="text-soft-gold p-2.5 sm:p-3 bg-deep-black/50 rounded-lg text-sm sm:text-base">
                          {[user?.address, user?.ward, user?.district, user?.city]
                            .filter(Boolean)
                            .join(', ') || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode */
                    <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label htmlFor="profile-name" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Họ và Tên
                          </label>
                          <input
                            type="text"
                            id="profile-name"
                            value={profileForm.full_name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border border-luxury-gold/30 hover:border-luxury-gold/50 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base"
                            placeholder="Nhập họ và tên"
                          />
                        </div>

                        <div>
                          <label htmlFor="profile-phone" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Số Điện Thoại
                          </label>
                          <input
                            type="tel"
                            id="profile-phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border border-luxury-gold/30 hover:border-luxury-gold/50 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base"
                            placeholder="0123 456 789"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="profile-address" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                          Địa Chỉ
                        </label>
                        <input
                          type="text"
                          id="profile-address"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border border-luxury-gold/30 hover:border-luxury-gold/50 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base"
                          placeholder="Số nhà, tên đường"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <label htmlFor="profile-ward" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Phường/Xã
                          </label>
                          <input
                            type="text"
                            id="profile-ward"
                            value={profileForm.ward}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, ward: e.target.value }))}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border border-luxury-gold/30 hover:border-luxury-gold/50 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base"
                            placeholder="Phường/Xã"
                          />
                        </div>

                        <div>
                          <label htmlFor="profile-district" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Quận/Huyện
                          </label>
                          <input
                            type="text"
                            id="profile-district"
                            value={profileForm.district}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, district: e.target.value }))}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border border-luxury-gold/30 hover:border-luxury-gold/50 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base"
                            placeholder="Quận/Huyện"
                          />
                        </div>

                        <div>
                          <label htmlFor="profile-city" className="block text-luxury-gold font-medium mb-2 text-sm sm:text-base">
                            Tỉnh/Thành
                          </label>
                          <input
                            type="text"
                            id="profile-city"
                            value={profileForm.city}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-deep-black/50 border border-luxury-gold/30 hover:border-luxury-gold/50 rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm sm:text-base"
                            placeholder="Tỉnh/Thành phố"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? 'Đang Cập Nhật...' : 'Cập Nhật Thông Tin'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="max-w-4xl mx-auto">
                {loadingOrders ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-luxury-gold text-3xl sm:text-4xl mb-3 sm:mb-4 animate-pulse">📦</div>
                    <p className="text-soft-gold text-sm sm:text-base">Đang tải lịch sử đơn hàng...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-luxury-gold text-4xl sm:text-6xl mb-4 sm:mb-6">📦</div>
                    <h2 className="font-luxury text-xl sm:text-2xl text-luxury-gold mb-3 sm:mb-4">
                      Chưa Có Đơn Hàng
                    </h2>
                    <p className="text-soft-gold mb-6 sm:mb-8 text-sm sm:text-base">
                      Bạn chưa đặt đơn hàng nào
                    </p>
                    <a
                      href="/products"
                      className="inline-block bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Mua Sắm Ngay
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-4 sm:mb-6">
                      Lịch Sử Đơn Hàng ({orders.length})
                    </h2>
                    
                    {orders.map((order) => (
                      <div key={order.id} className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
                          <div>
                            <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
                              {order.order_number}
                            </h3>
                            <p className="text-soft-gold text-xs sm:text-sm">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <p className={`font-medium text-sm sm:text-base ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </p>
                            <p className="text-soft-gold text-xs sm:text-sm">
                              {getPaymentMethodText(order.payment_method)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-soft-gold text-xs sm:text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{formatPrice(item.subtotal)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t border-luxury-gold/20 pt-3 sm:pt-4">
                          <div className="flex justify-between items-center">
                            <div className="text-soft-gold text-xs sm:text-sm">
                              <p>Tạm tính: {formatPrice(order.subtotal)}</p>
                              <p>Vận chuyển: {formatPrice(order.shipping_fee)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-luxury text-base sm:text-lg font-bold text-luxury-gold">
                                Tổng: {formatPrice(order.total_amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {order.notes && (
                          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-deep-black/50 rounded-lg">
                            <p className="text-soft-gold text-xs sm:text-sm">
                              <strong>Ghi chú:</strong> {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;