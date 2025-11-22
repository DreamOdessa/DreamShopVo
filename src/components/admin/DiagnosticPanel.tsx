import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiRefreshCw, FiInfo, FiTrash2, FiCheckCircle, FiEdit } from 'react-icons/fi';
import { siteSettingsService, productViewsService, productService } from '../../firebase/services';
import toast from 'react-hot-toast';

const DiagnosticContainer = styled.div`
  background: var(--admin-grey, #f8f9fa);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const DiagnosticTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--admin-dark, #2c3e50);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: var(--admin-primary, #00acc1);
  }
`;

const DiagnosticGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--admin-border, #e9ecef);
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--admin-dark-grey, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--admin-dark, #2c3e50);
  word-break: break-word;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: var(--admin-success, #28a745);
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #26c6da, #00acc1);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.75rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 172, 193, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.1rem;
  }
`;

const DangerButton = styled(ActionButton)`
  background: linear-gradient(135deg, #dc3545, #c82333);

  &:hover {
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
  }
`;

const Message = styled.div<{ type: 'success' | 'info' }>`
  background: ${props => props.type === 'success' ? '#d4edda' : '#d1ecf1'};
  color: ${props => props.type === 'success' ? '#155724' : '#0c5460'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeroEditorSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--admin-border, #e9ecef);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid var(--admin-border, #e9ecef);
  resize: vertical;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--admin-primary, #00acc1);
    box-shadow: 0 0 0 3px rgba(0, 172, 193, 0.1);
  }
`;

const ViewsStatsSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--admin-border, #e9ecef);
`;

const ProductViewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--admin-grey, #f8f9fa);
  border-radius: 8px;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProductName = styled.span`
  font-weight: 500;
  color: var(--admin-dark, #2c3e50);
  flex: 1;
`;

const ViewCount = styled.span`
  font-weight: 700;
  color: var(--admin-primary, #00acc1);
  font-size: 1.1rem;
  margin-left: 1rem;
`;

const DiagnosticPanel: React.FC = () => {
  const [buildHash, setBuildHash] = useState<string>('unknown');
  const [swStatus, setSwStatus] = useState<string>('checking...');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  
  // Hero editor
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [savingHero, setSavingHero] = useState(false);
  const [loadingHero, setLoadingHero] = useState(true);

  // Product views
  const [topProducts, setTopProducts] = useState<Array<{ productId: string; productName: string; views: number }>>([]);
  const [loadingViews, setLoadingViews] = useState(true);

  useEffect(() => {
    checkBuildInfo();
    checkServiceWorker();
    loadHeroSubtitle();
    loadProductViews();
  }, []);

  const loadHeroSubtitle = async () => {
    try {
      const data = await siteSettingsService.getMain();
      if (data?.heroSubtitle) {
        setHeroSubtitle(data.heroSubtitle);
      }
    } catch (error) {
      console.error('Error loading hero subtitle:', error);
    } finally {
      setLoadingHero(false);
    }
  };

  const loadProductViews = async () => {
    try {
      const views = await productViewsService.getTopViewed(10);
      // Загружаем названия продуктов
      const formatted = await Promise.all(
        views.map(async (v) => {
          try {
            const product = await productService.getById(v.productId);
            return {
              productId: v.productId,
              productName: product?.name || `Товар ${v.productId.substring(0, 8)}`,
              views: v.viewCount
            };
          } catch (error) {
            return {
              productId: v.productId,
              productName: `Товар ${v.productId.substring(0, 8)}`,
              views: v.viewCount
            };
          }
        })
      );
      setTopProducts(formatted);
    } catch (error) {
      console.error('Error loading product views:', error);
    } finally {
      setLoadingViews(false);
    }
  };

  const handleSaveHero = async () => {
    setSavingHero(true);
    try {
      await siteSettingsService.updateMain({ heroSubtitle: heroSubtitle.trim() });
      toast.success('Текст приветствия сохранен!');
    } catch (error) {
      console.error('Error saving hero:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setSavingHero(false);
    }
  };

  const checkBuildInfo = async () => {
    try {
      // Попытаемся получить hash из asset-manifest.json
      const response = await fetch('/asset-manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        // Попробуем извлечь хеш из имени файла
        const mainJs = manifest.files?.['main.js'] || '';
        const hashMatch = mainJs.match(/main\.([a-f0-9]+)\.js/);
        if (hashMatch) {
          setBuildHash(hashMatch[1].substring(0, 8));
        }
      }
    } catch (error) {
      console.error('Failed to fetch build info:', error);
    }

    // Последнее обновление из localStorage или текущее время
    const savedUpdate = localStorage.getItem('last-cache-clear');
    if (savedUpdate) {
      setLastUpdate(new Date(savedUpdate).toLocaleString('ru-RU'));
    } else {
      setLastUpdate('Неизвестно');
    }
  };

  const checkServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          setSwStatus('Активен');
        } else {
          setSwStatus('Не найден');
        }
      });
    } else {
      setSwStatus('Не поддерживается');
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm('Очистить весь кэш? Страница перезагрузится.')) return;

    try {
      // Очистка всех кэшей
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Снятие регистрации SW
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // Сохраняем время очистки
      localStorage.setItem('last-cache-clear', new Date().toISOString());

      // Перезагружаем страницу с очисткой кэша
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      setMessage({ text: 'Ошибка очистки кэша', type: 'info' });
    }
  };

  const handleHardReload = () => {
    // Жёсткая перезагрузка (Ctrl+Shift+R)
    window.location.reload();
  };

  const handleCheckUpdates = async () => {
    setMessage({ text: 'Проверка обновлений...', type: 'info' });
    
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        setMessage({ text: 'Проверка завершена. Если есть обновления, они будут установлены при следующей загрузке.', type: 'success' });
      } else {
        setMessage({ text: 'Service Worker не найден', type: 'info' });
      }
    } else {
      setMessage({ text: 'Service Worker не поддерживается', type: 'info' });
    }
  };

  return (
    <>
      <HeroEditorSection>
        <DiagnosticTitle>
          <FiEdit />
          Редактор текста приветствия
        </DiagnosticTitle>
        
        {loadingHero ? (
          <div style={{ padding: '1rem', color: 'var(--admin-dark-grey, #6c757d)' }}>
            Загрузка...
          </div>
        ) : (
          <>
            <InfoLabel style={{ marginBottom: '0.5rem' }}>Текст героя (главная страница)</InfoLabel>
            <TextArea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={4}
              placeholder="Введите текст приветствия..."
            />
            <ActionButton 
              onClick={handleSaveHero} 
              disabled={savingHero || !heroSubtitle.trim()}
              style={{ marginTop: '1rem' }}
            >
              <FiEdit />
              {savingHero ? 'Сохранение...' : 'Сохранить текст'}
            </ActionButton>
          </>
        )}
      </HeroEditorSection>

      <ViewsStatsSection>
        <DiagnosticTitle>
          <FiInfo />
          Топ просматриваемых товаров
        </DiagnosticTitle>

        {loadingViews ? (
          <div style={{ padding: '1rem', color: 'var(--admin-dark-grey, #6c757d)' }}>
            Загрузка статистики...
          </div>
        ) : topProducts.length === 0 ? (
          <div style={{ padding: '1rem', color: 'var(--admin-dark-grey, #6c757d)', textAlign: 'center' }}>
            Нет данных о просмотрах
          </div>
        ) : (
          topProducts.map((item, index) => (
            <ProductViewItem key={item.productId}>
              <ProductName>
                {index + 1}. {item.productName || `Товар ${item.productId.substring(0, 8)}`}
              </ProductName>
              <ViewCount>{item.views} просмотров</ViewCount>
            </ProductViewItem>
          ))
        )}
      </ViewsStatsSection>

      <DiagnosticContainer>
        <DiagnosticTitle>
          <FiInfo />
          Диагностика и обслуживание
        </DiagnosticTitle>

      <DiagnosticGrid>
        <InfoCard>
          <InfoLabel>Версия билда</InfoLabel>
          <InfoValue>{buildHash}</InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>Service Worker</InfoLabel>
          <InfoValue>
            {swStatus === 'Активен' && <FiCheckCircle />}
            {swStatus}
          </InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>Последняя очистка кэша</InfoLabel>
          <InfoValue>{lastUpdate}</InfoValue>
        </InfoCard>
      </DiagnosticGrid>

      <div>
        <ActionButton onClick={handleCheckUpdates}>
          <FiRefreshCw />
          Проверить обновления
        </ActionButton>

        <ActionButton onClick={handleHardReload}>
          <FiRefreshCw />
          Перезагрузить страницу
        </ActionButton>

        <DangerButton onClick={handleClearCache}>
          <FiTrash2 />
          Очистить кэш
        </DangerButton>
      </div>

      {message && (
        <Message type={message.type}>
          {message.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
          {message.text}
        </Message>
      )}
    </DiagnosticContainer>
    </>
  );
};

export default DiagnosticPanel;
