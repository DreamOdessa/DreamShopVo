import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CategorySidebarProvider } from './contexts/CategorySidebarContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
// Ленивые загрузки админских страниц для уменьшения бандла публичных страниц
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const AdminProductsPage = React.lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCategoriesPage = React.lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage'));
import { visitorService } from './firebase/services';
import LoadingSpinner from './components/LoadingSpinner';
import './utils/adminUtils'; // Импортируем утилиты для консоли

const App: React.FC = () => {
  const { loading } = useAuth();

  // Логирование уникального посетителя (guest или auth)
  React.useEffect(() => {
    let vid = localStorage.getItem('visitor_id');
    if (!vid) {
      vid = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('visitor_id', vid);
    }
    visitorService.logVisit(vid).catch(console.error);
  }, []);

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
            <Route path="/admin" element={<Suspense fallback={<LoadingSpinner />}><AdminPanel /></Suspense>} />
            <Route path="/admin/products" element={<Suspense fallback={<LoadingSpinner />}><AdminProductsPage /></Suspense>} />
            <Route path="/admin/users" element={<Suspense fallback={<LoadingSpinner />}><AdminUsersPage /></Suspense>} />
            <Route path="/admin/orders" element={<Suspense fallback={<LoadingSpinner />}><AdminOrdersPage /></Suspense>} />
            <Route path="/admin/categories" element={<Suspense fallback={<LoadingSpinner />}><AdminCategoriesPage /></Suspense>} />
            <Route path="/admin/settings" element={<Suspense fallback={<LoadingSpinner />}><AdminSettingsPage /></Suspense>} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
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
