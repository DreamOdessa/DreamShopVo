import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiPackage, FiShoppingBag, FiSave, FiX, FiGrid, FiEye, FiUpload, FiEyeOff, FiStar } from 'react-icons/fi';
import CategoryManager from '../components/CategoryManager';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { Product, Order } from '../types';
import OrderDetails from '../components/OrderDetails';
import toast from 'react-hot-toast';
import { storageService, STORAGE_PATHS } from '../firebase/storageService';

const AdminContainer = styled.div`
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
    padding: 0.4rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.3rem;
    font-size: 0.7rem;
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

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { products, users, orders, addProduct, updateProduct, deleteProduct, updateUserDiscount, updateOrderStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // const [editingUser, setEditingUser] = useState<User | null>(null); // Отключено для избежания неиспользуемой переменной
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    hoverImage: '',
    images: [] as string[],
    category: 'chips',
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

  if (!user?.isAdmin) {
    return (
      <AdminContainer>
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
      toast.error('Заполните все обязательные поля');
      return;
    }

    // Собираем все изображения в правильном порядке:
    // [главное фото, доп фото при hover, ...галерея]
    const allImages = [
      productForm.image,
      ...(productForm.hoverImage ? [productForm.hoverImage] : []),
      ...productForm.images
    ].filter(img => img && img.trim() !== ''); // Фильтруем пустые строки

    const productData = {
      ...productForm,
      image: productForm.image, // главное фото
      images: allImages.length > 0 ? allImages : [productForm.image], // Всегда массив с хотя бы одним изображением
      price: parseFloat(productForm.price),
      category: productForm.category as 'chips' | 'decorations' | 'syrups' | 'purees' | 'dried_flowers',
      isActive: productForm.isActive,
      isPopular: productForm.isPopular,
      ingredients: productForm.ingredients ? productForm.ingredients.split(',').map(i => i.trim()) : []
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Товар обновлен!');
    } else {
      addProduct(productData);
      toast.success('Товар добавлен!');
    }

    setShowModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(id);
      toast.success('Товар удален!');
    }
  };

  const handleToggleActive = (product: Product) => {
    const newActiveState = !product.isActive;
    updateProduct(product.id, { isActive: newActiveState });
    toast.success(newActiveState ? '✅ Товар активирован' : '👁️ Товар скрыт');
  };

  const handleTogglePopular = (product: Product) => {
    const newPopularState = !product.isPopular;
    updateProduct(product.id, { isPopular: newPopularState });
    toast.success(newPopularState ? '⭐ Товар добавлен в популярные' : '⭐ Товар убран из популярных');
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
      toast.error('❌ Ошибка загрузки изображения');
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
      toast.error('❌ Ошибка загрузки изображения');
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
      toast.error('❌ Ошибка загрузки изображений');
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
        toast.error('Ошибка удаления изображения');
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

  return (
    <AdminContainer>
      <Header>
        <div className="container">
          <Title>Адмін панель</Title>
          <Subtitle>Управління товарами, користувачами та замовленнями</Subtitle>
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
          <Tab isActive={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            <FiUsers />
            Користувачі
          </Tab>
          <Tab isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
            <FiShoppingBag />
            Замовлення
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

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Изображение</TableHeader>
                    <TableHeader>Название</TableHeader>
                    <TableHeader>Категория</TableHeader>
                    <TableHeader>Цена</TableHeader>
                    <TableHeader>Наличие</TableHeader>
                    <TableHeader>Действия</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
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
                      <TableCell>{product.category}</TableCell>
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
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                {products.map(product => (
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
                        <MobileCardValue>{product.category}</MobileCardValue>
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
                        {/*<ActionButton variant="edit" onClick={() => setEditingUser(user)}>
                          <FiEdit />
                        </ActionButton>*/}
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
                          <TableCell>
                            <ActionButton variant="edit" onClick={() => setSelectedOrder(order)}>
                              <FiEye />
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
                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as any }))}
              >
                <option value="chips">Фруктовые чипсы</option>
                <option value="decorations">Украшения</option>
                <option value="syrups">Сиропы</option>
                <option value="purees">Пюре</option>
                <option value="dried_flowers">Сухоцветы</option>
              </Select>
            </FormGroup>

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
    </AdminContainer>
  );
};

export default AdminPanel;

