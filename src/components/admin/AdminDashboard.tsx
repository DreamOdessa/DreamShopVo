import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiPackage, FiCalendar, FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { visitorService, productViewsService, productService } from '../../firebase/services';

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  totalProducts: number;
  ordersGrowth: number;
  usersGrowth: number;
  revenueGrowth: number;
  productsGrowth: number;
  processingOrders?: number;
  completedOrders?: number;
  cancelledOrders?: number;
}

interface ProductView {
  productId: string;
  viewCount: number;
  productName?: string;
}

interface AdminDashboardProps {
  stats: DashboardStats;
  onAddProduct?: () => void;
  onTabChange?: (tab: string) => void;
}

const DashboardContainer = styled.main`
  width: 100%;
  padding: 36px 24px;
  max-height: calc(100vh - 70px);
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const HeadTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

const TitleLeft = styled.div`
  h1 {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--admin-dark, #2c3e50);

    @media (max-width: 768px) {
      font-size: 28px;
    }
  }
`;

const Breadcrumb = styled.ul`
  display: flex;
  align-items: center;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    color: var(--admin-dark, #2c3e50);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    span {
      color: var(--admin-dark-grey, #6c757d);
      
      &.active {
        color: var(--admin-primary, #00acc1);
        font-weight: 600;
      }
    }

    svg {
      font-size: 18px;
    }
  }
`;

const DownloadButton = styled.button`
  height: 42px;
  padding: 0 20px;
  border-radius: 25px;
  background: var(--admin-primary, #00acc1);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background: var(--admin-primary-dark, #00838f);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 172, 193, 0.3);
  }

  svg {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    height: 38px;
    padding: 0 16px;
  }
`;

const BoxInfo = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 36px;
  list-style: none;
  padding: 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(motion.li)<{ color: string }>`
  padding: 24px;
  background: var(--admin-sidebar-bg, #ffffff);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  .icon {
    width: 80px;
    height: 80px;
    border-radius: 15px;
    font-size: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${props => props.color === 'blue' ? 'var(--admin-light-blue, #e0f7fa)' :
                           props.color === 'yellow' ? 'var(--admin-light-yellow, #fff9c4)' :
                           props.color === 'orange' ? 'var(--admin-light-orange, #ffe0b2)' :
                           'var(--admin-light-green, #c8e6c9)'};
    color: ${props => props.color === 'blue' ? 'var(--admin-primary, #00acc1)' :
                      props.color === 'yellow' ? 'var(--admin-yellow, #ffc107)' :
                      props.color === 'orange' ? 'var(--admin-orange, #ff9800)' :
                      'var(--admin-green, #4caf50)'};
    
    svg {
      width: 36px;
      height: 36px;
    }

    @media (max-width: 768px) {
      width: 65px;
      height: 65px;
      
      svg {
        width: 28px;
        height: 28px;
      }
    }
  }

  .text {
    flex: 1;

    h3 {
      font-size: 32px;
      font-weight: 700;
      color: var(--admin-dark, #2c3e50);
      margin: 0 0 8px 0;

      @media (max-width: 768px) {
        font-size: 26px;
      }
    }

    p {
      color: var(--admin-dark, #2c3e50);
      font-size: 15px;
      font-weight: 500;
      margin: 0 0 8px 0;
    }

    .growth {
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 5px;
      
      &.positive {
        color: var(--admin-green, #4caf50);
      }
      
      &.negative {
        color: var(--admin-red, #dc3545);
      }

      svg {
        font-size: 16px;
      }
    }
  }
`;

// const TableData = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
//   gap: 24px;
//   margin-top: 36px;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//     gap: 16px;
//     margin-top: 24px;
//   }
// `;

// const TableCard = styled.div`
//   background: var(--admin-sidebar-bg, #ffffff);
//   border-radius: 20px;
//   padding: 24px;
//   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

//   .head {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin-bottom: 20px;

//     h3 {
//       font-size: 20px;
//       font-weight: 600;
//       color: var(--admin-dark, #2c3e50);
//       margin: 0;
//     }

//     .view-all {
//       color: var(--admin-primary, #00acc1);
//       font-size: 14px;
//       font-weight: 600;
//       cursor: pointer;
//       text-decoration: none;
//       transition: all 0.3s ease;

//       &:hover {
//         color: var(--admin-primary-dark, #00838f);
//       }
//     }
//   }
// `;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 36px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled(motion.div)`
  background: linear-gradient(135deg, var(--admin-primary, #00acc1) 0%, var(--admin-primary-dark, #00838f) 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 172, 193, 0.3);
  }

  .icon {
    font-size: 28px;
    opacity: 0.9;
  }

  .text {
    h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: 13px;
      opacity: 0.9;
    }
  }
`;

const OrdersBreakdown = styled(motion.div)`
  margin-top: 10px;
  padding: 15px;
  background: rgba(0, 172, 193, 0.05);
  border-radius: 12px;
  border-left: 3px solid var(--admin-primary, #00acc1);
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 14px;
    color: var(--admin-dark-grey, #6c757d);
    display: flex;
    align-items: center;
    gap: 8px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      
      &.processing {
        background: var(--admin-yellow, #ffc107);
      }
      
      &.completed {
        background: var(--admin-green, #4caf50);
      }
      
      &.cancelled {
        background: var(--admin-red, #dc3545);
      }
    }
  }

  .value {
    font-size: 16px;
    font-weight: 600;
    color: var(--admin-dark, #2c3e50);
  }
`;

const VisitorStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 36px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VisitorCard = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  h3 {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 15px;
    margin: 0;
    opacity: 0.9;
  }

  .icon {
    font-size: 28px;
    margin-bottom: 10px;
    opacity: 0.8;
  }
`;

const TopProductsSection = styled.div`
  margin-top: 36px;
  background: var(--admin-sidebar-bg, #ffffff);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--admin-dark, #2c3e50);
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      color: var(--admin-primary, #00acc1);
    }
  }
`;

const ProductViewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  background: rgba(0, 172, 193, 0.03);
  margin-bottom: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 172, 193, 0.08);
    transform: translateX(5px);
  }

  .product-name {
    font-size: 15px;
    font-weight: 500;
    color: var(--admin-dark, #2c3e50);
  }

  .view-count {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--admin-primary, #00acc1);

    svg {
      font-size: 18px;
    }
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--admin-primary, #00acc1);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 172, 193, 0.1);
  }

  svg {
    font-size: 16px;
  }
`;

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, onAddProduct, onTabChange }) => {
  const navigate = useNavigate();
  const [visitorsToday, setVisitorsToday] = useState(0);
  const [visitorsMonth, setVisitorsMonth] = useState(0);
  const [topProducts, setTopProducts] = useState<ProductView[]>([]);
  const [showOrdersBreakdown, setShowOrdersBreakdown] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Load visitor stats
        const visitorCounts = await visitorService.getCounts();
        setVisitorsToday(visitorCounts.today);
        setVisitorsMonth(visitorCounts.month);

        // Load top viewed products
        const topViewed = await productViewsService.getTopViewed(5);
        
        // Fetch product names
        const productsWithNames = await Promise.all(
          topViewed.map(async (pv) => {
            try {
              const product = await productService.getById(pv.productId);
              return {
                ...pv,
                productName: product?.name || 'Неизвестный товар'
              };
            } catch {
              return {
                ...pv,
                productName: 'Неизвестный товар'
              };
            }
          })
        );
        
        setTopProducts(productsWithNames);
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadAnalytics();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardContainer>
      <HeadTitle>
        <TitleLeft>
          <h1>Dashboard</h1>
          <Breadcrumb>
            <li>
              <span>Dashboard</span>
            </li>
            <li>›</li>
            <li>
              <span className="active">Главная</span>
            </li>
          </Breadcrumb>
        </TitleLeft>
        <DownloadButton>
          <FiCalendar />
          <span>Отчет за месяц</span>
        </DownloadButton>
      </HeadTitle>

      <BoxInfo>
        <InfoCard
          color="blue"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => onTabChange ? onTabChange('orders') : navigate('/admin/orders')}
        >
          <div className="icon">
            <FiShoppingBag />
          </div>
          <div className="text">
            <h3>{stats.totalOrders}</h3>
            <p>Всего заказов</p>
            <div className={`growth ${stats.ordersGrowth >= 0 ? 'positive' : 'negative'}`}>
              <FiTrendingUp />
              {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth}% за месяц
            </div>
            <ExpandButton onClick={(e) => { e.stopPropagation(); setShowOrdersBreakdown(!showOrdersBreakdown); }}>
              {showOrdersBreakdown ? 'Скрыть детали' : 'Детализация'}
              {showOrdersBreakdown ? <FiChevronUp /> : <FiChevronDown />}
            </ExpandButton>
            <AnimatePresence>
              {showOrdersBreakdown && (
                <OrdersBreakdown
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BreakdownItem>
                    <div className="label">
                      <span className="dot processing"></span>
                      В обработке
                    </div>
                    <div className="value">{stats.processingOrders || 0}</div>
                  </BreakdownItem>
                  <BreakdownItem>
                    <div className="label">
                      <span className="dot completed"></span>
                      Доставленные
                    </div>
                    <div className="value">{stats.completedOrders || 0}</div>
                  </BreakdownItem>
                  <BreakdownItem>
                    <div className="label">
                      <span className="dot cancelled"></span>
                      Отмененные
                    </div>
                    <div className="value">{stats.cancelledOrders || 0}</div>
                  </BreakdownItem>
                </OrdersBreakdown>
              )}
            </AnimatePresence>
          </div>
        </InfoCard>

        <InfoCard
          color="yellow"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => onTabChange ? onTabChange('users') : navigate('/admin/users')}
        >
          <div className="icon">
            <FiUsers />
          </div>
          <div className="text">
            <h3>{stats.totalUsers}</h3>
            <p>Пользователей</p>
            <div className={`growth ${stats.usersGrowth >= 0 ? 'positive' : 'negative'}`}>
              <FiTrendingUp />
              {stats.usersGrowth >= 0 ? '+' : ''}{stats.usersGrowth}% за месяц
            </div>
          </div>
        </InfoCard>

        <InfoCard
          color="orange"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={() => onTabChange ? onTabChange('orders') : navigate('/admin/orders')}
        >
          <div className="icon">
            <FiDollarSign />
          </div>
          <div className="text">
            <h3>{stats.totalRevenue.toLocaleString('ru-RU')} ₴</h3>
            <p>Выручка</p>
            <div className={`growth ${stats.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              <FiTrendingUp />
              {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% за месяц
            </div>
          </div>
        </InfoCard>

        <InfoCard
          color="green"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.4 }}
          onClick={() => onTabChange ? onTabChange('products') : navigate('/admin/products')}
        >
          <div className="icon">
            <FiPackage />
          </div>
          <div className="text">
            <h3>{stats.totalProducts}</h3>
            <p>Товаров</p>
            <div className={`growth ${stats.productsGrowth >= 0 ? 'positive' : 'negative'}`}>
              <FiTrendingUp />
              {stats.productsGrowth >= 0 ? '+' : ''}{stats.productsGrowth}% за месяц
            </div>
          </div>
        </InfoCard>
      </BoxInfo>

      <QuickActions>
        <ActionCard
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (onAddProduct) {
              onAddProduct();
            } else if (onTabChange) {
              onTabChange('products');
            } else {
              navigate('/admin/products');
            }
          }}
        >
          <div className="icon">
            <FiPackage />
          </div>
          <div className="text">
            <h4>Добавить товар</h4>
            <p>Новый продукт в каталог</p>
          </div>
        </ActionCard>

        <ActionCard
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' }}
          onClick={() => onTabChange ? onTabChange('orders') : navigate('/admin/orders')}
        >
          <div className="icon">
            <FiShoppingBag />
          </div>
          <div className="text">
            <h4>Просмотр заказов</h4>
            <p>Управление заказами</p>
          </div>
        </ActionCard>

        <ActionCard
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' }}
          onClick={() => onTabChange ? onTabChange('users') : navigate('/admin/users')}
        >
          <div className="icon">
            <FiUsers />
          </div>
          <div className="text">
            <h4>База клиентов</h4>
            <p>Управление клиентами</p>
          </div>
        </ActionCard>
      </QuickActions>

      <VisitorStats>
        <VisitorCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="icon">
            <FiEye />
          </div>
          <h3>{visitorsToday}</h3>
          <p>Посетителей сегодня</p>
        </VisitorCard>
        
        <VisitorCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="icon">
            <FiCalendar />
          </div>
          <h3>{visitorsMonth}</h3>
          <p>Посетителей за месяц</p>
        </VisitorCard>
      </VisitorStats>

      {topProducts.length > 0 && (
        <TopProductsSection>
          <h3>
            <FiTrendingUp />
            Самые просматриваемые товары
          </h3>
          {topProducts.map((product, index) => (
            <ProductViewItem key={product.productId}>
              <div className="product-name">
                {index + 1}. {product.productName || product.productId}
              </div>
              <div className="view-count">
                <FiEye />
                {product.viewCount}
              </div>
            </ProductViewItem>
          ))}
        </TopProductsSection>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;
