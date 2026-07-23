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
import { visitorService } from './firebase/services';
import LoadingSpinner from './components/LoadingSpinner';
import BugReportToolWrapper from './components/BugReportTool';
import BugMarker from './components/BugReportTool/BugMarker';
import RequireAdmin from './components/RequireAdmin';

// Ленивые загрузки админских страниц для уменьшения бандла публичных страниц
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const AdminProductsPage = React.lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCategoriesPage = React.lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage'));

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
            <Route path="/admin" element={<RequireAdmin><Suspense fallback={<LoadingSpinner />}><AdminPanel /></Suspense></RequireAdmin>} />
            <Route path="/admin/products" element={<RequireAdmin><Suspense fallback={<LoadingSpinner />}><AdminProductsPage /></Suspense></RequireAdmin>} />
            <Route path="/admin/users" element={<RequireAdmin><Suspense fallback={<LoadingSpinner />}><AdminUsersPage /></Suspense></RequireAdmin>} />
            <Route path="/admin/orders" element={<RequireAdmin><Suspense fallback={<LoadingSpinner />}><AdminOrdersPage /></Suspense></RequireAdmin>} />
            <Route path="/admin/categories" element={<RequireAdmin><Suspense fallback={<LoadingSpinner />}><AdminCategoriesPage /></Suspense></RequireAdmin>} />
            <Route path="/admin/settings" element={<RequireAdmin><Suspense fallback={<LoadingSpinner />}><AdminSettingsPage /></Suspense></RequireAdmin>} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
        
        {/* Bug Report Tool - Lazy loaded only for admins/testers */}
        <BugReportToolWrapper />
        
        {/* Bug Marker - Shows bug location when ?bug_id=123 in URL */}
        <BugMarker />
        
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
