import React, { useState } from 'react';
import axios from 'axios';
import IonIcon from '../components/IonIcon';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ và tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập chủ đề';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung tin nhắn';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Tin nhắn quá ngắn (tối thiểu 10 ký tự)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      await axios.post(`${BACKEND_URL}/api/contact`, formData);
      
      setSubmitMessage('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitMessage('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessInfo = {
    address: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    phone: "0123 456 789",
    email: "info@khangtramhuong.com",
    workingHours: "Thứ 2 - Chủ Nhật: 8:00 - 20:00",
    socialMedia: [
      { name: "Facebook", url: "#", icon: "📘" },
      { name: "Instagram", url: "#", icon: "📸" },
      { name: "Zalo", url: "#", icon: "💬" },
      { name: "YouTube", url: "#", icon: "📺" }
    ]
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-deep-black mobile-nav-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-luxury-gold mb-3 sm:mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-soft-gold text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            Chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn về các sản phẩm trầm hương cao cấp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Contact Form */}
          <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6">
            <h2 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-4 sm:mb-6">
              Gửi Tin Nhắn
            </h2>
            
            {submitMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                submitMessage.includes('Cảm ơn') 
                  ? 'bg-green-900/30 border border-green-500/30 text-green-300'
                  : 'bg-red-900/30 border border-red-500/30 text-red-300'
              }`}>
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="full_name" className="block text-luxury-gold font-medium mb-1 text-sm">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm ${
                      errors.full_name ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                    }`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.full_name && (
                    <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-luxury-gold font-medium mb-1 text-sm">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm ${
                      errors.email ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-luxury-gold font-medium mb-1 text-sm">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm ${
                      errors.phone ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                    }`}
                    placeholder="0123 456 789"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-luxury-gold font-medium mb-1 text-sm">
                    Chủ Đề *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-deep-black/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 text-sm ${
                      errors.subject ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                    }`}
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
                    <option value="Báo giá">Báo giá</option>
                    <option value="Đổi trả">Đổi trả</option>
                    <option value="Khiếu nại">Khiếu nại</option>
                    <option value="Hợp tác">Hợp tác</option>
                    <option value="Khác">Khác</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-luxury-gold font-medium mb-1 text-sm">
                  Nội Dung Tin Nhắn *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-3 py-2 bg-deep-black/50 border rounded-lg text-white placeholder-soft-gold/60 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 resize-none text-sm ${
                    errors.message ? 'border-red-500' : 'border-luxury-gold/30 hover:border-luxury-gold/50'
                  }`}
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-luxury-gold to-luxury-copper text-deep-black px-4 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-luxury-gold/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm flex items-center justify-center space-x-2"
              >
                <IonIcon icon="send-outline" size={18} color="#1a1a1a" />
                <span>{isSubmitting ? 'Đang Gửi...' : 'Gửi Tin Nhắn'}</span>
              </button>
            </form>
          </div>

          {/* Business Information */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Contact Info */}
            <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6">
              <h2 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-4 sm:mb-6">
                Thông Tin Liên Hệ
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-luxury-gold text-sm">📍</span>
                  </div>
                  <div>
                    <h3 className="text-luxury-gold font-semibold mb-1 text-sm">Địa Chỉ</h3>
                    <p className="text-soft-gold text-xs sm:text-sm">{businessInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-luxury-gold text-sm">📞</span>
                  </div>
                  <div>
                    <h3 className="text-luxury-gold font-semibold mb-1 text-sm">Điện Thoại</h3>
                    <a href={`tel:${businessInfo.phone.replace(/\s/g, '')}`} 
                       className="text-soft-gold text-xs sm:text-sm hover:text-luxury-gold transition-colors">
                      {businessInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-luxury-gold text-sm">✉️</span>
                  </div>
                  <div>
                    <h3 className="text-luxury-gold font-semibold mb-1 text-sm">Email</h3>
                    <a href={`mailto:${businessInfo.email}`} 
                       className="text-soft-gold text-xs sm:text-sm hover:text-luxury-gold transition-colors">
                      {businessInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-luxury-gold text-sm">🕐</span>
                  </div>
                  <div>
                    <h3 className="text-luxury-gold font-semibold mb-1 text-sm">Giờ Làm Việc</h3>
                    <p className="text-soft-gold text-xs sm:text-sm">{businessInfo.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6">
              <h2 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-4 sm:mb-6">
                Kết Nối Với Chúng Tôi
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {businessInfo.socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="flex items-center space-x-2 p-2 sm:p-3 bg-deep-black/50 rounded-lg border border-luxury-gold/20 hover:border-luxury-gold/50 hover:bg-luxury-gold/10 transition-all duration-300 group"
                  >
                    <span className="text-sm sm:text-base">{social.icon}</span>
                    <span className="text-soft-gold group-hover:text-luxury-gold transition-colors text-xs sm:text-sm font-medium">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6">
              <h2 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-4 sm:mb-6">
                Bản Đồ
              </h2>
              <div className="relative overflow-hidden rounded-lg aspect-video bg-luxury-gold/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.524662664089!2d106.69522831533576!3d10.774335262275833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3328eb39%3A0x698f1e4a88679de!2zMTIzIMSQxrDhu51uZyBMw6ogTOG7o2ksIEJhbiBOZ2jDqSwgUXXhuq1uIDEsIFRoIHBkIEjDp20gTWluaCAoU2FpZ29uKSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1640995200000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 sm:mt-12 bg-charcoal/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/20 p-4 sm:p-6">
          <div className="text-center mb-6">
            <h2 className="font-luxury text-xl sm:text-2xl font-bold text-luxury-gold mb-3">
              Cam Kết Của Chúng Tôi
            </h2>
            <p className="text-soft-gold text-sm sm:text-base max-w-3xl mx-auto">
              Khang Trầm Hương cam kết mang đến cho khách hàng những sản phẩm trầm hương chất lượng cao nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center group">
              <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-luxury-gold/30 transition-colors">
                <span className="text-luxury-gold text-lg">🏆</span>
              </div>
              <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold mb-2">
                Chất Lượng Cao
              </h3>
              <p className="text-soft-gold text-xs sm:text-sm">
                Sản phẩm được tuyển chọn kỹ lưỡng từ những vùng trầm hương tốt nhất
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-luxury-gold/30 transition-colors">
                <span className="text-luxury-gold text-lg">🚚</span>
              </div>
              <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold mb-2">
                Giao Hàng Nhanh
              </h3>
              <p className="text-soft-gold text-xs sm:text-sm">
                Giao hàng toàn quốc, đảm bảo an toàn và đúng thời gian cam kết
              </p>
            </div>

            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-luxury-gold/30 transition-colors">
                <span className="text-luxury-gold text-lg">💬</span>
              </div>
              <h3 className="font-luxury text-base sm:text-lg font-bold text-luxury-gold mb-2">
                Tư Vấn Tận Tình
              </h3>
              <p className="text-soft-gold text-xs sm:text-sm">
                Đội ngũ chuyên gia sẵn sàng tư vấn và hỗ trợ 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;