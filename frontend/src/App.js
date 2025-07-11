import React, { useState, useEffect, Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import usePreloadResources from "./hooks/usePreloadResources";
// import { usePerformanceMonitor } from "./utils/performanceMonitor";

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

// Lazy loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));

// Loading component nhẹ nhàng không chói lóe
const PageLoadingSpinner = () => (
  <div className="bg-deep-black flex items-center justify-center py-20">
    <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const [isMobile, setIsMobile] = useState(false);

  // Preload critical resources
  usePreloadResources();
  
  // Performance monitoring - disabled for now to avoid issues
  // usePerformanceMonitor(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hiển thị footer ở tất cả các trang
  const showFooter = true;

  return (
    <div className="App bg-deep-black text-white">
      <ScrollToTop />
      {!isMobile && <Header />}
      
      <main className={`${isMobile ? 'pb-20' : 'pt-0'}`}>
        <Suspense fallback={<PageLoadingSpinner />}>
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
        </Suspense>
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