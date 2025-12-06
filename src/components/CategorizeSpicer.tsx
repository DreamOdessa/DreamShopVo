import React, { useState } from 'react';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import styled from 'styled-components';
import toast from 'react-hot-toast';

// Правила категоризации на основе названия товара
function categorizeProduct(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  // ДЖИН
  if (lowerTitle.includes('gin') || lowerTitle.includes('джин')) {
    return 'джин';
  }
  
  // ЛІКЕР
  if (lowerTitle.includes('лікер') || lowerTitle.includes('liker') || 
      lowerTitle.includes('liqueur') || lowerTitle.includes('cream') ||
      lowerTitle.includes('co-co') || lowerTitle.includes('cherry') ||
      lowerTitle.includes('currant') || lowerTitle.includes('chocolate')) {
    return 'лікер';
  }
  
  // DISTILL
  if (lowerTitle.includes('distill') || lowerTitle.includes('бренді') || 
      lowerTitle.includes('brandy')) {
    return 'distill';
  }
  
  // НАСТОЯНКИ
  if (lowerTitle.includes('настоян') || lowerTitle.includes('настой') || 
      lowerTitle.includes('infusion') || lowerTitle.includes('тинктура') ||
      lowerTitle.includes('tincture')) {
    return 'настоянки';
  }
  
  // СПАЙСЕРИ (специи, пряности)
  if (lowerTitle.includes('spice') || lowerTitle.includes('спайс') || 
      lowerTitle.includes('spicer') || lowerTitle.includes('том ям') ||
      lowerTitle.includes('том-ям') || lowerTitle.includes('tom yam') ||
      lowerTitle.includes('чілі') || lowerTitle.includes('chili') ||
      lowerTitle.includes('curry') || lowerTitle.includes('каррі') ||
      lowerTitle.includes('pepper') || lowerTitle.includes('перець')) {
    return 'спайсери';
  }
  
  // По умолчанию
  return 'спайсери';
}

interface CategoryStats {
  'джин': number;
  'лікер': number;
  'distill': number;
  'спайсери': number;
  'настоянки': number;
}

const CategorizeSpicer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog(prev => [...prev, message]);
  };

  const updateSpicerProductsCategories = async () => {
    try {
      setLoading(true);
      setLog([]);
      addLog('🔄 Начинаем обновление категорий товаров Spicer...');
      
      // Получаем все товары Spicer
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('brand', '==', 'spicer'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        addLog('❌ Товары Spicer не найдены');
        toast.error('Товары Spicer не найдены');
        return;
      }
      
      addLog(`📦 Найдено товаров Spicer: ${snapshot.size}`);
      
      const batch = writeBatch(db);
      let updateCount = 0;
      const categoriesStats: CategoryStats = {
        'джин': 0,
        'лікер': 0,
        'distill': 0,
        'спайсери': 0,
        'настоянки': 0
      };
      
      snapshot.forEach((docSnap) => {
        const product = docSnap.data();
        const title = product.name || product.title || '';
        
        // Определяем категорию
        const category = categorizeProduct(title);
        
        // Обновляем только если категория изменилась
        if (product.subcategory !== category) {
          const docRef = doc(db, 'products', docSnap.id);
          batch.update(docRef, {
            subcategory: category,
            category: 'spicer',
            updatedAt: serverTimestamp()
          });
          
          updateCount++;
          categoriesStats[category as keyof CategoryStats]++;
          
          addLog(`✅ ${title} → ${category}`);
        } else {
          categoriesStats[category as keyof CategoryStats]++;
        }
      });
      
      // Сохраняем изменения
      if (updateCount > 0) {
        await batch.commit();
        addLog(`\n✨ Успешно обновлено товаров: ${updateCount}`);
        toast.success(`Обновлено товаров: ${updateCount}`);
      } else {
        addLog('ℹ️  Все товары уже имеют правильные категории');
        toast('Все товары уже категоризированы', { icon: 'ℹ️' });
      }
      
      setStats(categoriesStats);
      addLog('\n📊 Статистика по категориям:');
      addLog(`   🍸 Джин: ${categoriesStats['джин']}`);
      addLog(`   🥃 Лікери: ${categoriesStats['лікер']}`);
      addLog(`   🍷 Distill: ${categoriesStats['distill']}`);
      addLog(`   🌶️  Спайсери: ${categoriesStats['спайсери']}`);
      addLog(`   🍇 Настоянки: ${categoriesStats['настоянки']}`);
      
    } catch (error) {
      console.error('❌ Ошибка при обновлении категорий:', error);
      addLog(`❌ Ошибка: ${error}`);
      toast.error('Ошибка при обновлении категорий');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>🔧 Категоризация товаров Spicer</Title>
      
      <Description>
        Этот инструмент автоматически распределит все товары Spicer по 5 категориям:
        <br />
        🍸 Джин • 🥃 Лікери • 🍷 Distill • 🌶️ Спайсери • 🍇 Настоянки
      </Description>

      <Button onClick={updateSpicerProductsCategories} disabled={loading}>
        {loading ? '⏳ Обрабатываем...' : '▶️ Запустить категоризацию'}
      </Button>

      {stats && (
        <StatsBox>
          <h3>📊 Статистика:</h3>
          <StatItem>🍸 Джин: <strong>{stats['джин']}</strong></StatItem>
          <StatItem>🥃 Лікери: <strong>{stats['лікер']}</strong></StatItem>
          <StatItem>🍷 Distill: <strong>{stats['distill']}</strong></StatItem>
          <StatItem>🌶️ Спайсери: <strong>{stats['спайсери']}</strong></StatItem>
          <StatItem>🍇 Настоянки: <strong>{stats['настоянки']}</strong></StatItem>
          <TotalItem>📦 Всего: <strong>{Object.values(stats).reduce((a, b) => a + b, 0)}</strong></TotalItem>
        </StatsBox>
      )}

      {log.length > 0 && (
        <LogBox>
          <h3>📝 Лог выполнения:</h3>
          {log.map((line, index) => (
            <LogLine key={index}>{line}</LogLine>
          ))}
        </LogBox>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 30px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatsBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;

  h3 {
    color: white;
    margin-bottom: 15px;
  }
`;

const StatItem = styled.div`
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  strong {
    float: right;
    color: #ffd700;
  }
`;

const TotalItem = styled(StatItem)`
  border-bottom: none;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
`;

const LogBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;

  h3 {
    color: white;
    margin-bottom: 15px;
  }
`;

const LogLine = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  padding: 4px 0;
  white-space: pre-wrap;
`;

export default CategorizeSpicer;
