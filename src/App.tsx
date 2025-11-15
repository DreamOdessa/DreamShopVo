import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CategorySidebarProvider } from './contexts/CategorySidebarContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import AdminPanel from './pages/AdminPanel';
import LoadingSpinner from './components/LoadingSpinner';
import './utils/adminUtils'; // Импортируем утилиты для консоли

const App: React.FC = () => {
  const { loading } = useAuth();

  return (
    <WishlistProvider>
      <CategorySidebarProvider>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
        {loading && (
          <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.6)',backdropFilter:'blur(2px)',zIndex:9999}}>
            <LoadingSpinner />
          </div>
        )}
      </CategorySidebarProvider>
    </WishlistProvider>
  );
};

export default App;
