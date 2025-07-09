import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

// Components
import MobileNavigation from "./components/MobileNavigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotificationContainer from "./components/NotificationContainer";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

function AppContent() {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Hiển thị footer ở tất cả các trang
  const showFooter = true;

  return (
    <div className="App min-h-screen bg-deep-black text-white">
      <ScrollToTop />
      {!isMobile && <Header />}
      
      <main className={`${isMobile ? 'pb-20' : 'pt-0'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Routes>
      </main>

      {showFooter && <Footer />}

      {isMobile && <MobileNavigation />}
      
      {/* Notification Container */}
      <NotificationContainer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;