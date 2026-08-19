import React, { Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import MaintenancePage from './MaintenancePage';

// Старый сайт временно закрыт для посетителей. Оставьте true, пока идёт перенос.
const MAINTENANCE_MODE = true;
// Личная ссылка для работы со старым сайтом. Не публикуйте её.
const PRIVATE_ACCESS_PATH = '/_dreamshop-staff-9cf35c52db9e5d1a440e4e9b10e66974118e09e369151e77';
const PRIVATE_ACCESS_STORAGE_KEY = 'dreamshop_private_maintenance_access';

// Ленивые загрузки админских страниц для уменьшения бандла публичных страниц
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const AdminProductsPage = React.lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCategoriesPage = React.lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage'));

const PrivateAccess: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    sessionStorage.setItem(PRIVATE_ACCESS_STORAGE_KEY, 'granted');
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

const MaintenanceGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const hasPrivateAccess = sessionStorage.getItem(PRIVATE_ACCESS_STORAGE_KEY) === 'granted';

  if (!MAINTENANCE_MODE || hasPrivateAccess) {
    return <>{children}</>;
  }

  if (pathname === PRIVATE_ACCESS_PATH) {
    return <PrivateAccess />;
  }

  return <MaintenancePage />;
};

const App: React.FC = () => {
  const { loading } = useAuth();
  const { pathname } = useLocation();

  // Логирование уникального посетителя (guest или auth)
  React.useEffect(() => {
    if (MAINTENANCE_MODE && pathname !== PRIVATE_ACCESS_PATH) {
      return;
    }

    let vid = localStorage.getItem('visitor_id');
    if (!vid) {
      vid = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('visitor_id', vid);
    }
    visitorService.logVisit(vid).catch(console.error);
  }, [pathname]);

  return (
    <MaintenanceGate>
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
    </MaintenanceGate>
  );
};

export default App;
