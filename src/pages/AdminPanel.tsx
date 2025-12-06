import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiPackage, FiShoppingBag, FiSave, FiX, FiGrid, FiEye, FiUpload, FiEyeOff, FiStar, FiTag, FiChevronDown, FiSettings, FiAlertCircle } from 'react-icons/fi';
import CategoryManager from '../components/CategoryManager';
import CategoryShowcaseManager from '../components/CategoryShowcaseManager';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserProfileModal from '../components/admin/UserProfileModal';
import DiagnosticPanel from '../components/admin/DiagnosticPanel';
import BugReportsPanel from '../components/admin/BugReportsPanel';
import CategorizeSpicer from '../components/CategorizeSpicer';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { Product, Order, User } from '../types';
import OrderDetails from '../components/OrderDetails';
import toast from 'react-hot-toast';
import { storageService, STORAGE_PATHS } from '../firebase/storageService';
import { requestNotificationPermission } from '../firebase/messaging';
import { FiBell } from 'react-icons/fi';

const AdminContainer = styled.div<{ isSidebarHidden: boolean }>`
  position: relative;
  width: calc(100% - ${props => props.isSidebarHidden ? '60px' : '280px'});
  left: ${props => props.isSidebarHidden ? '60px' : '280px'};
  transition: all 0.3s ease;
  min-height: 100vh;
  background: var(--admin-content-bg, #f8f9fa);

  @media (max-width: 768px) {
    width: ${props => props.isSidebarHidden ? '100%' : 'calc(100% - 250px)'};
    left: ${props => props.isSidebarHidden ? '0' : '250px'};
  }
`;

const OldAdminContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
  margin-top: -4rem;

  @media (max-width: 768px) {
    padding: 2rem 0;
    margin-top: -2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0;
    margin-top: -1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }

  @media (max-width: 360px) {
    font-size: 1.3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0 1rem;
  }
`;

const AdminContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 20px;

  @media (max-width: 768px) {
    padding: 1rem 10px;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  border-radius: 15px;
  padding: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.25rem;
    margin-bottom: 1rem;
  }
`;

const Tab = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.isActive ? 'linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%)' : 'transparent'};
  color: ${props => props.isActive ? 'white' : '#6c757d'};
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.isActive ? 'linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%)' : '#f8f9fa'};
    color: ${props => props.isActive ? 'white' : '#00acc1'};
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    border-radius: 10px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 150, 136, 0.3);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileTable = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-top: 1rem;
  }
`;

const MobileCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MobileCardTitle = styled.h4`
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
`;

const MobileCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const MobileCardLabel = styled.span`
  font-weight: 500;
  color: #6c757d;
`;

const MobileCardValue = styled.span`
  color: #2c3e50;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
`;

const MobileActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  justify-content: flex-end;
`;

const TableHeader = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
`;

const TableRow = styled.tr`
  transition: background-color 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' | 'save' | 'cancel' }>`
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.2rem;

  ${props => {
    switch (props.variant) {
      case 'edit':
        return `
          background: #3498db;
          color: white;
          &:hover { background: #2980b9; }
        `;
      case 'delete':
        return `
          background: #e74c3c;
          color: white;
          &:hover { background: #c0392b; }
        `;
      case 'save':
        return `
          background: #27ae60;
          color: white;
          &:hover { background: #229954; }
        `;
      case 'cancel':
        return `
          background: #95a5a6;
          color: white;
          &:hover { background: #7f8c8d; }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #6c757d;
          &:hover { background: #e9ecef; }
        `;
    }
  }}

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 1rem;
    min-width: 44px;
    min-height: 44px;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
    min-width: 40px;
    min-height: 40px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 60px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

// Контейнер фільтра категорій
const CategoryFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
`;

// Чіп категорії
const CategoryChip = styled.button<{ isActive: boolean }>`
  padding: 0.6rem 1.2rem;
  border: 2px solid ${props => props.isActive ? '#00acc1' : '#e9ecef'};
  background: ${props => props.isActive ? 'linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%)' : 'white'};
  color: ${props => props.isActive ? 'white' : '#6c757d'};
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 172, 193, 0.2);
    border-color: #00acc1;
    color: ${props => props.isActive ? 'white' : '#00acc1'};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
    max-height: 90vh;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    width: 98%;
    border-radius: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 50%;

  &:hover {
    background: #f8f9fa;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1.5rem;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 150, 136, 0.3);
          }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #6c757d;
          border: 2px solid #e9ecef;
          &:hover {
            background: #e9ecef;
          }
        `;
    }
  }}

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;

    h3 {
      font-size: 1.3rem;
    }

    p {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0.5rem;

    h3 {
      font-size: 1.1rem;
    }

    p {
      font-size: 0.8rem;
    }
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
  }
`;

const ImagePreviewImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f8f9fa;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: #e74c3c;
    transform: scale(1.1);
  }
`;

const UploadButtonWrapper = styled.div<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  pointer-events: ${props => props.$disabled ? 'none' : 'auto'};

  &:hover {
    ${props => !props.$disabled && `
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    `}
  }

  input {
    display: none;
  }
`;

const SubcategoryDropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const SubcategoryButton = styled.button<{ hasSubcategory: boolean }>`
  padding: 0.5rem 0.8rem;
  background: ${props => props.hasSubcategory ? '#00acc1' : '#f8f9fa'};
  color: ${props => props.hasSubcategory ? 'white' : '#6c757d'};
  border: 2px solid ${props => props.hasSubcategory ? '#00acc1' : '#e9ecef'};
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;

  &:hover {
    background: ${props => props.hasSubcategory ? '#0097a7' : '#e9ecef'};
    border-color: #00acc1;
    transform: translateY(-1px);
  }

  svg {
    font-size: 0.9rem;
  }
`;

const SubcategoryDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 180px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

const SubcategoryOption = styled.div<{ isSelected: boolean }>`
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? '#e8f8f9' : 'transparent'};
  color: ${props => props.isSelected ? '#00acc1' : '#495057'};
  font-weight: ${props => props.isSelected ? '600' : '400'};
  font-size: 0.9rem;

  &:hover {
    background: #e8f8f9;
    color: #00acc1;
  }

  &:first-child {
    border-radius: 10px 10px 0 0;
  }

  &:last-child {
    border-radius: 0 0 10px 10px;
  }
`;

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { products, users, orders, categories, addProduct, updateProduct, deleteProduct, updateUser, updateUserDiscount, updateOrderStatus, deleteOrder } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Фільтр по категории (slug)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'none' | null>(null); // Фильтр по подкатегории
  
  // Spicer категорії для ручного призначення
  const spicerCategories = ['Подарункові набори', 'Спешл'];
  const [selectedSpicerCategory, setSelectedSpicerCategory] = useState<string>('');
  const [spicerProductsToUpdate, setSpicerProductsToUpdate] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    hoverImage: '',
    images: [] as string[],
    category: 'chips',
    subcategory: '',
    organic: false,
    inStock: true,
    isActive: true,
    isPopular: false,
    weight: '',
    ingredients: ''
  });
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [hoverImagePreview, setHoverImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [openSubcategoryDropdown, setOpenSubcategoryDropdown] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Dark mode toggle
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('admin-dark-mode');
    if (savedDarkMode === 'enabled') {
      setIsDarkMode(true);
      document.body.classList.add('admin-dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('admin-dark-mode');
      localStorage.setItem('admin-dark-mode', 'enabled');
    } else {
      document.body.classList.remove('admin-dark-mode');
      localStorage.setItem('admin-dark-mode', 'disabled');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  // Calculate stats for dashboard
  const dashboardStats = {
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalProducts: products.length,
    ordersGrowth: 12.5,
    usersGrowth: 8.3,
    revenueGrowth: 15.7,
    productsGrowth: 5.2,
    processingOrders: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length
  };
  const pendingOrders = orders.filter(o => o.status === 'pending');

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openSubcategoryDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-wrapper]')) {
          setOpenSubcategoryDropdown(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openSubcategoryDropdown]);

  // Слушатель входящих уведомлений (уже обрабатывается в NotificationContext)
  // Удалено дублирование

  // Проверка статуса разрешения уведомлений
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!user) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    try {
      const token = await requestNotificationPermission(user.id);
      if (token) {
        setNotificationsEnabled(true);
        toast.success('✅ Уведомления включены!');
      }
    } catch (error: any) {
      console.error('Ошибка включения уведомлений:', error);
      if (error.message?.includes('VAPID')) {
        toast.error('⚙️ VAPID ключ не настроен. Проверьте консоль для инструкций.');
      } else if (error.message?.includes('отклонено')) {
        toast.error('❌ Вы отклонили разрешение на уведомления');
      } else {
        toast.error('❌ Не удалось включить уведомления: ' + (error.message || 'Неизвестная ошибка'));
      }
    }
  };

  if (!user?.isAdmin) {
    return (
      <AdminContainer isSidebarHidden={false}>
        <div className="container">
          <EmptyState>
            <h3>Доступ запрещен</h3>
            <p>У вас нет прав для доступа к админ панели</p>
          </EmptyState>
        </div>
      </AdminContainer>
    );
  }

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: '',
      hoverImage: '',
      images: [],
      category: 'chips',
      subcategory: '',
      organic: false,
      inStock: true,
      isActive: true,
      isPopular: false,
      weight: '',
      ingredients: ''
    });
    setImagePreviewUrls([]);
    setMainImagePreview('');
    setHoverImagePreview('');
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    
    // Получаем главное фото, доп фото и галерею
    const mainImage = product.image;
    const hoverImg = product.images && product.images.length > 1 ? product.images[1] : '';
    const galleryImages = product.images && product.images.length > 2 ? product.images.slice(2) : [];
    
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: mainImage,
      hoverImage: hoverImg,
      images: galleryImages,
      category: product.category,
      subcategory: product.subcategory || '',
      organic: product.organic,
      inStock: product.inStock,
      isActive: product.isActive ?? true,
      isPopular: product.isPopular ?? false,
      weight: product.weight || '',
      ingredients: product.ingredients?.join(', ') || ''
    });
    setImagePreviewUrls(galleryImages);
    setMainImagePreview(mainImage);
    setHoverImagePreview(hoverImg);
    setShowModal(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.image) {
      toast.error('Заповніть всі обов\'язкові поля');
      return;
    }

    try {
      // Собираем все изображения в правильном порядке:
      // [главное фото, доп фото при hover, ...галерея]
      const allImages = [
        productForm.image,
        ...(productForm.hoverImage ? [productForm.hoverImage] : []),
        ...productForm.images
      ].filter(img => img && img.trim() !== ''); // Фільтруем пустые строки

      const productData = {
        ...productForm,
        image: productForm.image, // главное фото
        images: allImages.length > 0 ? allImages : [productForm.image], // Всегда массив с хотя бы одним изображением
        price: parseFloat(productForm.price),
        category: productForm.category as 'chips' | 'decorations' | 'syrups' | 'purees' | 'dried_flowers',
        subcategory: productForm.subcategory || undefined,
        isActive: productForm.isActive,
        isPopular: productForm.isPopular,
        ingredients: productForm.ingredients ? productForm.ingredients.split(',').map(i => i.trim()) : []
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Помилка збереження товару:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
      await deleteProduct(id);
    }
  };

  const handleToggleActive = async (product: Product) => {
    const newActiveState = !product.isActive;
    await updateProduct(product.id, { isActive: newActiveState });
  };

  const handleTogglePopular = async (product: Product) => {
    const newPopularState = !product.isPopular;
    await updateProduct(product.id, { isPopular: newPopularState });
  };

  const handleQuickSubcategoryChange = async (productId: string, newSubcategory: string | null) => {
    try {
      await updateProduct(productId, { subcategory: newSubcategory || undefined });
      setOpenSubcategoryDropdown(null);
    } catch (error) {
      toast.error('Помилка при оновленні підкатегорії');
      console.error(error);
    }
  };

  const getSubcategoriesForProduct = (product: Product): string[] => {
    // Находим подкатегории для категории товара
    return categories
      .filter(cat => cat.parentSlug === product.category && cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(cat => cat.name);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер изображения не должен превышать 5MB');
      return;
    }

    setIsUploading(true);
    const fileId = `main-${Date.now()}`;
    
    try {
      // Создаем превью
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);

      // Загружаем в Firebase Storage
      const downloadURL = await storageService.uploadFile(
        file, 
        STORAGE_PATHS.PRODUCT_MAIN_IMAGES,
        (progress) => {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      );

      // Сохраняем URL из Firebase Storage
      setProductForm(prev => ({ ...prev, image: downloadURL }));
      toast.success('✅ Главное изображение загружено!');
      
      // Очищаем превью URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error('Ошибка загрузки главного изображения:', error);
      const msg = (error as any)?.message || String(error);
      toast.error(`❌ Ошибка загрузки изображения: ${msg}`);
      setMainImagePreview('');
    } finally {
      setIsUploading(false);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  };

  const handleHoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер изображения не должен превышать 5MB');
      return;
    }

    setIsUploading(true);
    const fileId = `hover-${Date.now()}`;
    
    try {
      // Создаем превью
      const previewUrl = URL.createObjectURL(file);
      setHoverImagePreview(previewUrl);

      // Загружаем в Firebase Storage
      const downloadURL = await storageService.uploadFile(
        file, 
        STORAGE_PATHS.PRODUCT_HOVER_IMAGES,
        (progress) => {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      );

      // Сохраняем URL из Firebase Storage
      setProductForm(prev => ({ ...prev, hoverImage: downloadURL }));
      toast.success('✅ Дополнительное изображение загружено!');
      
      // Очищаем превью URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
        console.error('Ошибка загрузки дополнительного изображения:', error);
        const msg = (error as any)?.message || String(error);
        toast.error(`❌ Ошибка загрузки изображения: ${msg}`);
      setHoverImagePreview('');
    } finally {
      setIsUploading(false);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Проверяем общее количество изображений в галерее (максимум 3)
    if (imagePreviewUrls.length + files.length > 3) {
      toast.error('Максимум 3 изображения в галерее');
      return;
    }

    // Проверяем размер каждого файла (максимум 5MB)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Размер изображения не должен превышать 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Создаем превью изображений
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);

      // Загружаем все файлы в Firebase Storage
      const downloadURLs = await storageService.uploadMultipleFiles(
        files,
        STORAGE_PATHS.PRODUCT_GALLERY,
        (fileIndex, progress) => {
          const fileId = `gallery-${Date.now()}-${fileIndex}`;
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      );

      // Сохраняем URL из Firebase Storage
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, ...downloadURLs]
      }));
      
      toast.success(`✅ Загружено ${files.length} изображений в галерею!`);
      
      // Очищаем превью URL
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    } catch (error) {
        console.error('Ошибка загрузки изображений галереи:', error);
        const msg = (error as any)?.message || String(error);
        toast.error(`❌ Ошибка загрузки изображений: ${msg}`);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = productForm.images[index];
    
    // Если изображение из Firebase Storage, удаляем его
    if (imageUrl && storageService.isFirebaseStorageURL(imageUrl)) {
      try {
        await storageService.deleteFile(imageUrl);
        toast.success('Изображение удалено из хранилища');
      } catch (error) {
        console.error('Ошибка удаления изображения из Firebase Storage:', error);
        const msg = (error as any)?.message || String(error);
        toast.error(`Ошибка удаления изображения: ${msg}`);
      }
    }
    
    // Удаляем из всех массивов
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleUserDiscountChange = (userId: string, discount: number) => {
    updateUserDiscount(userId, discount);
    toast.success('Скидка обновлена!');
  };

  const handleOrderStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    toast.success('Статус заказа обновлен!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#6c757d';
    }
  };

  // const getStatusText = (status: string) => {
  //   switch (status) {
  //     case 'pending': return 'Ожидает';
  //     case 'processing': return 'Обрабатывается';
  //     case 'shipped': return 'Отправлен';
  //     case 'delivered': return 'Доставлен';
  //     case 'cancelled': return 'Отменен';
  //     default: return status;
  //   }
  // }; // Отключено для избежания неиспользуемой функции

  // Функція для масового оновлення Spicer категорій
  const handleUpdateSpicerCategories = async () => {
    if (!selectedSpicerCategory) {
      toast.error('Виберіть категорію Spicer');
      return;
    }
    
    if (spicerProductsToUpdate.size === 0) {
      toast.error('Виберіть товари для оновлення');
      return;
    }

    try {
      const updatePromises = Array.from(spicerProductsToUpdate).map(async (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
          await updateProduct(productId, {
            ...product,
            subcategory: selectedSpicerCategory
          });
        }
      });

      await Promise.all(updatePromises);
      toast.success(`Оновлено ${spicerProductsToUpdate.size} товарів`);
      setSpicerProductsToUpdate(new Set());
      setSelectedSpicerCategory('');
    } catch (error) {
      console.error('Помилка оновлення категорій:', error);
      toast.error('Помилка при оновленні категорій');
    }
  };

  const toggleSpicerProduct = (productId: string) => {
    setSpicerProductsToUpdate(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const selectAllSpicerProducts = () => {
    const spicerProducts = products.filter(p => p.brand === 'spicer');
    setSpicerProductsToUpdate(new Set(spicerProducts.map(p => p.id)));
  };

  const deselectAllSpicerProducts = () => {
    setSpicerProductsToUpdate(new Set());
  };

  return (
    <>
      <AdminSidebar 
        isHidden={isSidebarHidden} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <AdminContainer isSidebarHidden={isSidebarHidden}>
        <AdminNavbar 
          onToggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          pendingCount={pendingOrders.length}
          pendingPreview={pendingOrders.slice(0,5)}
          onNavigateToOrders={() => setActiveTab('orders')}
        />
        
        {activeTab === 'dashboard' && (
          <AdminDashboard 
            stats={dashboardStats} 
            onAddProduct={() => { setActiveTab('products'); handleAddProduct(); }}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab !== 'dashboard' && (
          <OldAdminContainer>
            <Header>
              <div className="container">
                <Title>Адмін панель</Title>
                <Subtitle>Управління товарами, користувачами та замовленнями</Subtitle>
                        {!notificationsEnabled && (
                          <button
                            onClick={handleEnableNotifications}
                            style={{
                              marginTop: '1rem',
                              padding: '0.8rem 1.5rem',
                              background: 'rgba(255, 255, 255, 0.2)',
                              border: '2px solid rgba(255, 255, 255, 0.5)',
                              borderRadius: '25px',
                              color: 'white',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <FiBell />
                            Включить уведомления о заказах
                          </button>
                        )}
              </div>
      </Header>

      <AdminContent>
        <Tabs>
          <Tab isActive={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            <FiPackage />
            Товари
          </Tab>
          <Tab isActive={activeTab === 'categories'} onClick={() => setActiveTab('categories')}>
            <FiGrid />
            Категорії
          </Tab>
          <Tab isActive={activeTab === 'showcase'} onClick={() => setActiveTab('showcase')}>
            <FiEye />
            Витрина
          </Tab>
          <Tab isActive={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            <FiUsers />
            Користувачі
          </Tab>
          <Tab isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
            <FiShoppingBag />
            Замовлення
          </Tab>
          <Tab isActive={activeTab === 'bugs'} onClick={() => setActiveTab('bugs')}>
            <FiAlertCircle />
            Звіти про баги
          </Tab>
          <Tab isActive={activeTab === 'spicer'} onClick={() => setActiveTab('spicer')}>
            <FiPackage />
            Spicer категорії
          </Tab>
        </Tabs>

        <Content>
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiPackage />
                  Управление товарами
                </SectionTitle>
                <AddButton onClick={handleAddProduct}>
                  <FiPlus />
                  Добавить товар
                </AddButton>
              </SectionHeader>

              {/* Фильтр категорий (только родительские) */}
              <CategoryFilterContainer>
                <CategoryChip 
                  isActive={selectedCategory === 'all'} 
                  onClick={() => { setSelectedCategory('all'); setSelectedSubcategory(null); }}
                >
                  Всі ({products.length})
                </CategoryChip>
                {categories.filter(c => !c.parentSlug).map(cat => {
                  const slug = cat.slug || cat.id;
                  const count = products.filter(p => p.category === slug).length;
                  return (
                    <CategoryChip 
                      key={cat.id} 
                      isActive={selectedCategory === slug}
                      onClick={() => { setSelectedCategory(slug); setSelectedSubcategory(null); }}
                    >
                      {cat.name} ({count})
                    </CategoryChip>
                  );
                })}
              </CategoryFilterContainer>

              {/* Фильтр подкатегорий внутри выбранной категории */}
              {selectedCategory !== 'all' && (
                <CategoryFilterContainer>
                  {/* Показать все товары категории */}
                  <CategoryChip 
                    isActive={selectedSubcategory === null}
                    onClick={() => setSelectedSubcategory(null)}
                  >
                    Всі підкатегорії
                  </CategoryChip>
                  {/* Фильтр только без подкатегории */}
                  <CategoryChip 
                    isActive={selectedSubcategory === 'none'}
                    onClick={() => setSelectedSubcategory(selectedSubcategory === 'none' ? null : 'none')}
                  >
                    Без підкатегорії ({products.filter(p => p.category === selectedCategory && !p.subcategory).length})
                  </CategoryChip>
                  {/* Список подкатегорий для выбранной категории */}
                  {categories
                    .filter(c => c.parentSlug === selectedCategory)
                    .map(sub => {
                      const count = products.filter(p => p.category === selectedCategory && p.subcategory === sub.name).length;
                      return (
                        <CategoryChip
                          key={sub.id}
                          isActive={selectedSubcategory === sub.name}
                          onClick={() => setSelectedSubcategory(selectedSubcategory === sub.name ? null : sub.name)}
                        >
                          {sub.name} ({count})
                        </CategoryChip>
                      );
                    })}
                </CategoryFilterContainer>
              )}

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Изображение</TableHeader>
                    <TableHeader>Название</TableHeader>
                    <TableHeader>Категория / Подкатегория</TableHeader>
                    <TableHeader>Цена</TableHeader>
                    <TableHeader>Наличие</TableHeader>
                    <TableHeader>Действия</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(p => {
                      // Фильтр по категории
                      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
                      // Фильтр по подкатегории
                      if (selectedSubcategory === 'none') return !p.subcategory;
                      if (selectedSubcategory) return p.subcategory === selectedSubcategory;
                      return true;
                    })
                    .map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div style={{ fontWeight: '600', color: '#2c3e50' }}>{product.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.category}
                        {product.subcategory && (
                          <div style={{ fontSize: '0.7rem', color: '#00acc1', marginTop: '2px' }}>↳ {product.subcategory}</div>
                        )}
                      </TableCell>
                      <TableCell>{product.price} ₴</TableCell>
                      <TableCell>
                        <span style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: product.inStock ? '#d4edda' : '#f8d7da',
                          color: product.inStock ? '#155724' : '#721c24'
                        }}>
                          {product.inStock ? 'В наличии' : 'Нет в наличии'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <ActionButton 
                            variant="edit" 
                            onClick={() => handleToggleActive(product)}
                            title={product.isActive ? 'Скрыть товар' : 'Показать товар'}
                            style={{ 
                              color: product.isActive ? '#27ae60' : '#95a5a6',
                              background: product.isActive ? '#d4edda' : '#f8f9fa'
                            }}
                          >
                            {product.isActive ? <FiEye /> : <FiEyeOff />}
                          </ActionButton>
                          <ActionButton 
                            variant="edit" 
                            onClick={() => handleTogglePopular(product)}
                            title={product.isPopular ? 'Убрать из популярных' : 'Добавить в популярные'}
                            style={{ 
                              color: product.isPopular ? '#f39c12' : '#95a5a6',
                              background: product.isPopular ? '#fff3cd' : '#f8f9fa',
                              fill: product.isPopular ? '#f39c12' : 'none'
                            }}
                          >
                            <FiStar style={{ fill: product.isPopular ? '#f39c12' : 'none' }} />
                          </ActionButton>
                          
                          {/* Быстрое назначение подкатегории */}
                          <SubcategoryDropdownWrapper data-dropdown-wrapper>
                            <SubcategoryButton
                              hasSubcategory={!!product.subcategory}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenSubcategoryDropdown(openSubcategoryDropdown === product.id ? null : product.id);
                              }}
                              title="Быстро назначить подкатегорию"
                            >
                              <FiTag />
                              {product.subcategory ? product.subcategory.substring(0, 8) : 'Подкат.'}
                              <FiChevronDown style={{ fontSize: '0.8rem' }} />
                            </SubcategoryButton>
                            <SubcategoryDropdown 
                              isOpen={openSubcategoryDropdown === product.id}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SubcategoryOption
                                isSelected={!product.subcategory}
                                onClick={() => handleQuickSubcategoryChange(product.id, null)}
                              >
                                Без подкатегории
                              </SubcategoryOption>
                              {getSubcategoriesForProduct(product).map(subcat => (
                                <SubcategoryOption
                                  key={subcat}
                                  isSelected={product.subcategory === subcat}
                                  onClick={() => handleQuickSubcategoryChange(product.id, subcat)}
                                >
                                  {subcat}
                                </SubcategoryOption>
                              ))}
                              {getSubcategoriesForProduct(product).length === 0 && (
                                <SubcategoryOption isSelected={false} style={{ cursor: 'default', color: '#999' }}>
                                  Нет подкатегорий
                                </SubcategoryOption>
                              )}
                            </SubcategoryDropdown>
                          </SubcategoryDropdownWrapper>

                          <ActionButton variant="edit" onClick={() => handleEditProduct(product)}>
                            <FiEdit />
                          </ActionButton>
                          <ActionButton variant="delete" onClick={() => handleDeleteProduct(product.id)}>
                            <FiTrash2 />
                          </ActionButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>

              {/* Мобильная версия таблицы товаров */}
              <MobileTable>
                {products
                  .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
                  .map(product => (
                  <MobileCard key={product.id}>
                    <MobileCardHeader>
                      <MobileCardTitle>{product.name}</MobileCardTitle>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </MobileCardHeader>
                    <MobileCardContent>
                      <MobileCardRow>
                        <MobileCardLabel>Описание:</MobileCardLabel>
                        <MobileCardValue>{product.description.substring(0, 50)}...</MobileCardValue>
                      </MobileCardRow>
                      <MobileCardRow>
                        <MobileCardLabel>Категория:</MobileCardLabel>
                        <MobileCardValue>
                          {product.category}
                          {product.subcategory && (
                            <span style={{ display: 'block', fontSize: '0.65rem', color: '#00acc1' }}>↳ {product.subcategory}</span>
                          )}
                        </MobileCardValue>
                      </MobileCardRow>
                      <MobileCardRow>
                        <MobileCardLabel>Цена:</MobileCardLabel>
                        <MobileCardValue>{product.price} ₴</MobileCardValue>
                      </MobileCardRow>
                      <MobileCardRow>
                        <MobileCardLabel>Статус:</MobileCardLabel>
                        <MobileCardValue>
                          <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            background: product.inStock ? '#d4edda' : '#f8d7da',
                            color: product.inStock ? '#155724' : '#721c24'
                          }}>
                            {product.inStock ? 'В наличии' : 'Нет в наличии'}
                          </span>
                        </MobileCardValue>
                      </MobileCardRow>
                    </MobileCardContent>
                    <MobileActions>
                      <ActionButton 
                        variant="edit" 
                        onClick={() => handleToggleActive(product)}
                        title={product.isActive ? 'Скрыть товар' : 'Показать товар'}
                        style={{ 
                          color: product.isActive ? '#27ae60' : '#95a5a6',
                          background: product.isActive ? '#d4edda' : '#f8f9fa'
                        }}
                      >
                        {product.isActive ? <FiEye /> : <FiEyeOff />}
                      </ActionButton>
                      <ActionButton 
                        variant="edit" 
                        onClick={() => handleTogglePopular(product)}
                        title={product.isPopular ? 'Убрать из популярных' : 'Добавить в популярные'}
                        style={{ 
                          color: product.isPopular ? '#f39c12' : '#95a5a6',
                          background: product.isPopular ? '#fff3cd' : '#f8f9fa'
                        }}
                      >
                        <FiStar style={{ fill: product.isPopular ? '#f39c12' : 'none' }} />
                      </ActionButton>
                      
                      {/* Быстрое назначение подкатегории - мобильная версия */}
                      <SubcategoryDropdownWrapper data-dropdown-wrapper>
                        <SubcategoryButton
                          hasSubcategory={!!product.subcategory}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenSubcategoryDropdown(openSubcategoryDropdown === product.id ? null : product.id);
                          }}
                          title="Быстро назначить подкатегорию"
                          style={{ fontSize: '0.75rem', padding: '0.6rem 0.7rem' }}
                        >
                          <FiTag />
                          <FiChevronDown style={{ fontSize: '0.7rem' }} />
                        </SubcategoryButton>
                        <SubcategoryDropdown 
                          isOpen={openSubcategoryDropdown === product.id}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SubcategoryOption
                            isSelected={!product.subcategory}
                            onClick={() => handleQuickSubcategoryChange(product.id, null)}
                          >
                            Без подкатегории
                          </SubcategoryOption>
                          {getSubcategoriesForProduct(product).map(subcat => (
                            <SubcategoryOption
                              key={subcat}
                              isSelected={product.subcategory === subcat}
                              onClick={() => handleQuickSubcategoryChange(product.id, subcat)}
                            >
                              {subcat}
                            </SubcategoryOption>
                          ))}
                          {getSubcategoriesForProduct(product).length === 0 && (
                            <SubcategoryOption isSelected={false} style={{ cursor: 'default', color: '#999' }}>
                              Нет подкатегорий
                            </SubcategoryOption>
                          )}
                        </SubcategoryDropdown>
                      </SubcategoryDropdownWrapper>

                      <ActionButton variant="edit" onClick={() => handleEditProduct(product)}>
                        <FiEdit />
                      </ActionButton>
                      <ActionButton variant="delete" onClick={() => handleDeleteProduct(product.id)}>
                        <FiTrash2 />
                      </ActionButton>
                    </MobileActions>
                  </MobileCard>
                ))}
              </MobileTable>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryManager />
            </motion.div>
          )}

          {activeTab === 'showcase' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiEye />
                  Управление витриной
                </SectionTitle>
              </SectionHeader>

              <CategoryShowcaseManager />
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiUsers />
                  Управление пользователями
                </SectionTitle>
              </SectionHeader>

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Имя</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Скидка</TableHeader>
                    <TableHeader>Действия</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={user.discount || 0}
                          onChange={(e) => handleUserDiscountChange(user.id, parseInt(e.target.value) || 0)}
                          style={{ width: '80px' }}
                        />
                        <span style={{ marginLeft: '0.5rem', color: '#6c757d' }}>%</span>
                      </TableCell>
                      <TableCell>
                        <ActionButton variant="edit" onClick={() => setSelectedUser(user)}>
                          <FiEye />
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>

              {/* Мобильная версия таблицы пользователей */}
              <MobileTable>
                {users.map(user => (
                  <MobileCard key={user.id}>
                    <MobileCardHeader>
                      <MobileCardTitle>{user.name}</MobileCardTitle>
                    </MobileCardHeader>
                    <MobileCardContent>
                      <MobileCardRow>
                        <MobileCardLabel>Email:</MobileCardLabel>
                        <MobileCardValue>{user.email}</MobileCardValue>
                      </MobileCardRow>
                      <MobileCardRow>
                        <MobileCardLabel>Скидка:</MobileCardLabel>
                        <MobileCardValue>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={user.discount || 0}
                            onChange={(e) => handleUserDiscountChange(user.id, parseInt(e.target.value) || 0)}
                            style={{ width: '60px', padding: '0.3rem', fontSize: '0.8rem' }}
                          />
                          <span style={{ marginLeft: '0.3rem', color: '#6c757d', fontSize: '0.8rem' }}>%</span>
                        </MobileCardValue>
                      </MobileCardRow>
                    </MobileCardContent>
                  </MobileCard>
                ))}
              </MobileTable>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiSettings />
                  Настройки системы
                </SectionTitle>
              </SectionHeader>

              <CategorizeSpicer />
              
              <div style={{ marginTop: '40px' }}>
                <DiagnosticPanel />
              </div>
            </motion.div>
          )}

          {activeTab === 'bugs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BugReportsPanel />
            </motion.div>
          )}

          {activeTab === 'spicer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiPackage />
                  Управління Spicer категоріями
                </SectionTitle>
              </SectionHeader>

              <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Масове призначення категорій</h3>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <Select
                    value={selectedSpicerCategory}
                    onChange={(e) => setSelectedSpicerCategory(e.target.value)}
                    style={{ flex: '1', minWidth: '200px' }}
                  >
                    <option value="">Виберіть категорію Spicer</option>
                    {spicerCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                  <AddButton onClick={handleUpdateSpicerCategories} disabled={!selectedSpicerCategory || spicerProductsToUpdate.size === 0}>
                    Оновити ({spicerProductsToUpdate.size})
                  </AddButton>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={selectAllSpicerProducts}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#00acc1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Вибрати всі
                  </button>
                  <button
                    onClick={deselectAllSpicerProducts}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Скасувати вибір
                  </button>
                </div>
              </div>

              <Table>
                <thead>
                  <tr>
                    <TableHeader style={{ width: '50px' }}>
                      <input
                        type="checkbox"
                        checked={spicerProductsToUpdate.size === products.filter(p => p.brand === 'spicer').length && products.filter(p => p.brand === 'spicer').length > 0}
                        onChange={(e) => e.target.checked ? selectAllSpicerProducts() : deselectAllSpicerProducts()}
                      />
                    </TableHeader>
                    <TableHeader>Зображення</TableHeader>
                    <TableHeader>Назва</TableHeader>
                    <TableHeader>Категорія</TableHeader>
                    <TableHeader>Поточна Spicer категорія</TableHeader>
                    <TableHeader>Об'єм</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(p => p.brand === 'spicer').map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={spicerProductsToUpdate.has(product.id)}
                          onChange={() => toggleSpicerProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <span style={{
                          padding: '0.3rem 0.8rem',
                          background: product.subcategory ? '#00acc1' : '#e9ecef',
                          color: product.subcategory ? 'white' : '#6c757d',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}>
                          {product.subcategory || 'Не призначено'}
                        </span>
                      </TableCell>
                      <TableCell>{product.volume || '—'}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>

              {products.filter(p => p.brand === 'spicer').length === 0 && (
                <EmptyState>
                  <h3>Немає товарів Spicer</h3>
                  <p>Товари бренду Spicer будуть відображатися тут</p>
                </EmptyState>
              )}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiShoppingBag />
                  Управление заказами
                </SectionTitle>
              </SectionHeader>

              {orders.length === 0 ? (
                <EmptyState>
                  <h3>Нет заказов</h3>
                  <p>Заказы будут отображаться здесь</p>
                </EmptyState>
              ) : (
                <>
                  <Table>
                    <thead>
                      <tr>
                        <TableHeader>ID замовлення</TableHeader>
                        <TableHeader>Клієнт</TableHeader>
                        <TableHeader>Товари</TableHeader>
                        <TableHeader>Сума</TableHeader>
                        <TableHeader>Статус</TableHeader>
                        <TableHeader>Дата</TableHeader>
                        <TableHeader>Дії</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.shippingAddress.name}</TableCell>
                          <TableCell>{order.items.length} товаров</TableCell>
                          <TableCell>{order.total} ₴</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                              style={{ background: getStatusColor(order.status), color: 'white', border: 'none' }}
                            >
                              <option value="pending">Ожидает</option>
                              <option value="processing">Обрабатывается</option>
                              <option value="shipped">Отправлен</option>
                              <option value="delivered">Доставлен</option>
                              <option value="cancelled">Отменен</option>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                          </TableCell>
                          <TableCell style={{display:'flex',gap:'6px'}}>
                            <ActionButton variant="edit" onClick={() => setSelectedOrder(order)}>
                              <FiEye />
                            </ActionButton>
                            <ActionButton 
                              variant="delete" 
                              onClick={async () => {
                                if (window.confirm('Удалить заказ навсегда?')) {
                                  await deleteOrder(order.id);
                                }
                              }}
                            >
                              <FiX />
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>

                  {/* Мобильная версия таблицы заказов */}
                  <MobileTable>
                    {orders.map(order => (
                      <MobileCard key={order.id}>
                        <MobileCardHeader>
                          <MobileCardTitle>Заказ #{order.id}</MobileCardTitle>
                          <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            background: getStatusColor(order.status),
                            color: 'white'
                          }}>
                            {order.status}
                          </span>
                        </MobileCardHeader>
                        <MobileCardContent>
                          <MobileCardRow>
                            <MobileCardLabel>Клиент:</MobileCardLabel>
                            <MobileCardValue>{order.shippingAddress.name}</MobileCardValue>
                          </MobileCardRow>
                          <MobileCardRow>
                            <MobileCardLabel>Товары:</MobileCardLabel>
                            <MobileCardValue>{order.items.length} товаров</MobileCardValue>
                          </MobileCardRow>
                          <MobileCardRow>
                            <MobileCardLabel>Сумма:</MobileCardLabel>
                            <MobileCardValue>{order.total} ₴</MobileCardValue>
                          </MobileCardRow>
                          <MobileCardRow>
                            <MobileCardLabel>Дата:</MobileCardLabel>
                            <MobileCardValue>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</MobileCardValue>
                          </MobileCardRow>
                          <MobileCardRow>
                            <MobileCardLabel>Статус:</MobileCardLabel>
                            <MobileCardValue>
                              <Select
                                value={order.status}
                                onChange={(e) => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                                style={{ 
                                  background: getStatusColor(order.status), 
                                  color: 'white', 
                                  border: 'none',
                                  padding: '0.3rem',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem'
                                }}
                              >
                                <option value="pending">Ожидает</option>
                                <option value="processing">Обрабатывается</option>
                                <option value="shipped">Отправлен</option>
                                <option value="delivered">Доставлен</option>
                                <option value="cancelled">Отменен</option>
                              </Select>
                            </MobileCardValue>
                          </MobileCardRow>
                        </MobileCardContent>
                        <MobileActions>
                          <ActionButton variant="edit" onClick={() => setSelectedOrder(order)}>
                            <FiEye />
                          </ActionButton>
                        </MobileActions>
                      </MobileCard>
                    ))}
                  </MobileTable>
                </>
              )}
            </motion.div>
          )}
        </Content>
      </AdminContent>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <FormGroup>
              <Label>Название *</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Название товара"
              />
            </FormGroup>

            <FormGroup>
              <Label>Описание *</Label>
              <TextArea
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Описание товара"
              />
            </FormGroup>

            <FormGroup>
              <Label>Цена *</Label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Цена в рублях"
              />
            </FormGroup>

            <FormGroup>
              <Label>Главное фото *</Label>
              <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                Введите URL изображения или загрузите файл в Firebase Storage
              </p>
              <Input
                value={productForm.image}
                onChange={(e) => {
                  setProductForm(prev => ({ ...prev, image: e.target.value }));
                  setMainImagePreview(e.target.value);
                }}
                placeholder="https://example.com/image.jpg"
              />
              
              <UploadButtonWrapper $disabled={isUploading} as="label">
                <FiUpload />
                {isUploading ? 'Загрузка...' : 'Загрузить главное фото'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  disabled={isUploading}
                />
              </UploadButtonWrapper>

              {Object.keys(uploadProgress).some(key => key.startsWith('main-')) && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${Object.values(uploadProgress).find((_, i, arr) => i === 0) || 0}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #4dd0e1, #26c6da)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '0.25rem' }}>
                    Загрузка: {Math.round(Object.values(uploadProgress).find((_, i, arr) => i === 0) || 0)}%
                  </p>
                </div>
              )}

              {mainImagePreview && (
                <div style={{ marginTop: '1rem' }}>
                  <ImagePreview style={{ maxWidth: '200px' }}>
                    <ImagePreviewImg src={mainImagePreview} alt="Главное фото" />
                  </ImagePreview>
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Доп фото (при наведении)</Label>
              <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                Введите URL изображения или загрузите файл в Firebase Storage
              </p>
              <Input
                value={productForm.hoverImage}
                onChange={(e) => {
                  setProductForm(prev => ({ ...prev, hoverImage: e.target.value }));
                  setHoverImagePreview(e.target.value);
                }}
                placeholder="https://example.com/hover-image.jpg"
              />
              
              <UploadButtonWrapper $disabled={isUploading} as="label">
                <FiUpload />
                {isUploading ? 'Загрузка...' : 'Загрузить доп фото'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHoverImageUpload}
                  disabled={isUploading}
                />
              </UploadButtonWrapper>

              {Object.keys(uploadProgress).some(key => key.startsWith('hover-')) && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${Object.values(uploadProgress).find((_, i, arr) => i === 0) || 0}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #4dd0e1, #26c6da)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '0.25rem' }}>
                    Загрузка: {Math.round(Object.values(uploadProgress).find((_, i, arr) => i === 0) || 0)}%
                  </p>
                </div>
              )}

              {hoverImagePreview && (
                <div style={{ marginTop: '1rem' }}>
                  <ImagePreview style={{ maxWidth: '200px' }}>
                    <ImagePreviewImg src={hoverImagePreview} alt="Доп фото" />
                  </ImagePreview>
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Галерея (максимум 3 изображения)</Label>
              <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                Введите URL изображений через запятую или загрузите файлы в Firebase Storage
              </p>
              <Input
                value={productForm.images.join(', ')}
                onChange={(e) => {
                  const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
                  setProductForm(prev => ({ ...prev, images: urls }));
                  setImagePreviewUrls(urls);
                }}
                placeholder="https://example.com/gallery1.jpg, https://example.com/gallery2.jpg"
              />
              
              <UploadButtonWrapper $disabled={isUploading || imagePreviewUrls.length >= 3} style={{ marginTop: '0.5rem' }} as="label">
                <FiUpload />
                {isUploading ? 'Загрузка...' : 'Загрузить изображения в галерею'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImageUpload}
                  disabled={isUploading || imagePreviewUrls.length >= 3}
                />
              </UploadButtonWrapper>

              {Object.keys(uploadProgress).some(key => key.startsWith('gallery-')) && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${Object.values(uploadProgress).reduce((acc, val) => acc + val, 0) / Object.keys(uploadProgress).length}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #4dd0e1, #26c6da)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '0.25rem' }}>
                    Загрузка: {Math.round(Object.values(uploadProgress).reduce((acc, val) => acc + val, 0) / Object.keys(uploadProgress).length)}%
                  </p>
                </div>
              )}

              {imagePreviewUrls.length > 0 && (
                <ImageGallery>
                  {imagePreviewUrls.map((url, index) => (
                    <ImagePreview key={index}>
                      <ImagePreviewImg src={url} alt={`Галерея ${index + 1}`} />
                      <RemoveImageButton onClick={() => handleRemoveImage(index)}>
                        ×
                      </RemoveImageButton>
                    </ImagePreview>
                  ))}
                </ImageGallery>
              )}
              
              {imagePreviewUrls.length < 3 && (
                <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.5rem' }}>
                  Загружено: {imagePreviewUrls.length} / 3 изображений
                </p>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Категория</Label>
              <Select
                value={productForm.category}
                onChange={(e) => {
                  const val = e.target.value;
                  setProductForm(prev => ({ ...prev, category: val as any, subcategory: '' }));
                }}
              >
                {categories.filter(c => !c.parentSlug).sort((a,b)=>a.sortOrder-b.sortOrder).map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </Select>
            </FormGroup>

            {(() => {
              const subcats = categories.filter(c => c.parentSlug === productForm.category);
              if (!subcats.length) return null;
              return (
                <FormGroup>
                  <Label>Підкатегорія</Label>
                  <Select
                    value={productForm.subcategory}
                    onChange={(e) => setProductForm(prev => ({ ...prev, subcategory: e.target.value }))}
                  >
                    <option value=''>— вибрати —</option>
                    {subcats.sort((a,b)=>a.sortOrder-b.sortOrder).map(sc => (
                      <option key={sc.id} value={sc.name}>{sc.name}</option>
                    ))}
                  </Select>
                </FormGroup>
              );
            })()}

            <FormGroup>
              <Label>Статус товара</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <span>Товар активен (отображается в каталоге)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productForm.isPopular}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                  />
                  <span>Популярный товар (отображается на главной)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                  />
                  <span>В наличии</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productForm.organic}
                    onChange={(e) => setProductForm(prev => ({ ...prev, organic: e.target.checked }))}
                  />
                  <span>Органический продукт</span>
                </label>
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Вес</Label>
              <Input
                value={productForm.weight}
                onChange={(e) => setProductForm(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="100г, 250мл и т.д."
              />
            </FormGroup>

            <FormGroup>
              <Label>Ингредиенты (через запятую)</Label>
              <Input
                value={productForm.ingredients}
                onChange={(e) => setProductForm(prev => ({ ...prev, ingredients: e.target.value }))}
                placeholder="Яблоки, корица, лимонный сок"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={productForm.organic}
                  onChange={(e) => setProductForm(prev => ({ ...prev, organic: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Органический продукт
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                В наличии
              </Label>
            </FormGroup>

            <ModalButtons>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                <FiX />
                Отмена
              </Button>
              <Button variant="primary" onClick={handleSaveProduct}>
                <FiSave />
                Сохранить
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}

      {/* Детальный просмотр заказа */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrint={() => {
            // Функция печати накладной
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head>
                    <title>Накладна #${selectedOrder.id}</title>
                    <style>
                      body { font-family: Arial, sans-serif; margin: 20px; }
                      .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                      .section { margin: 20px 0; }
                      .info { display: flex; justify-content: space-between; margin: 10px 0; }
                      .items { border: 1px solid #333; border-collapse: collapse; width: 100%; }
                      .items th, .items td { border: 1px solid #333; padding: 8px; text-align: left; }
                      .total { text-align: right; font-weight: bold; margin-top: 20px; }
                    </style>
                  </head>
                  <body>
                    <div class="header">
                      <h1>DreamShop</h1>
                      <h2>Накладна #${selectedOrder.id}</h2>
                      <p>Дата: ${new Date(selectedOrder.createdAt).toLocaleString('uk-UA')}</p>
                    </div>
                    
                    <div class="section">
                      <h3>Клієнт:</h3>
                      <div class="info">
                        <span>Ім'я: ${selectedOrder.customerInfo?.firstName || selectedOrder.shippingAddress.name.split(' ')[0]}</span>
                        <span>Телефон: ${selectedOrder.customerInfo?.phone || selectedOrder.shippingAddress.phone}</span>
                      </div>
                      <div class="info">
                        <span>Місто: ${selectedOrder.deliveryInfo?.city || selectedOrder.shippingAddress.city}</span>
                        <span>Адреса: ${selectedOrder.deliveryInfo?.deliveryDetails || selectedOrder.shippingAddress.address}</span>
                      </div>
                    </div>
                    
                    <div class="section">
                      <h3>Товари:</h3>
                      <table class="items">
                        <tr>
                          <th>Товар</th>
                          <th>Кількість</th>
                          <th>Ціна</th>
                          <th>Сума</th>
                        </tr>
                        ${selectedOrder.items.map(item => `
                          <tr>
                            <td>${item.product.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.product.price} ₴</td>
                            <td>${item.product.price * item.quantity} ₴</td>
                          </tr>
                        `).join('')}
                      </table>
                      <div class="total">Загальна сума: ${selectedOrder.total} ₴</div>
                    </div>
                  </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.print();
            }
          }}
        />
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdateUser={updateUser}
        />
      )}
          </OldAdminContainer>
        )}
      </AdminContainer>
    </>
  );
};

export default AdminPanel;

