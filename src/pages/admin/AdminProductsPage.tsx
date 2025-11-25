import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../contexts/AdminContext';

const Container = styled.div`
  padding: 2rem;
`;

const Heading = styled.h1`
  font-size: 1.8rem;
  margin: 0 0 1.5rem;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button<{active:boolean}>`
  padding: .6rem 1rem;
  border-radius: 8px;
  border: 1px solid ${p=>p.active ? '#f4d03f' : '#ccc'};
  background: ${p=>p.active ? 'linear-gradient(135deg,#f4d03f,#f39c12)' : '#fff'};
  color: ${p=>p.active ? '#000' : '#333'};
  cursor: pointer;
  font-weight: ${p=>p.active ? 600 : 400};
  transition:.2s;
  &:hover { border-color:#f4d03f; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: .9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: .6rem .5rem;
  background:#fafafa;
  border-bottom:1px solid #e0e0e0;
  position:sticky;
  top:0;
  z-index:1;
`;

const Td = styled.td`
  padding:.55rem .5rem;
  border-bottom:1px solid #eee;
  vertical-align: top;
`;

const PopularToggle = styled.button<{active:boolean}>`
  padding:.4rem .7rem;
  border-radius:6px;
  border:1px solid ${p=>p.active ? '#27ae60' : '#bbb'};
  background:${p=>p.active ? '#27ae60' : 'transparent'};
  color:${p=>p.active ? '#fff' : '#333'};
  cursor:pointer;
  font-size:.75rem;
  font-weight:600;
  letter-spacing:.5px;
  &:hover { border-color:#27ae60; }
`;

const Badge = styled.span<{type:'spicer'|'other'}>`
  display:inline-block;
  padding: .25rem .55rem;
  border-radius: 6px;
  font-size: .65rem;
  letter-spacing:.5px;
  background: ${p=>p.type==='spicer' ? 'linear-gradient(135deg,#f4d03f,#f39c12)' : '#4dd0e1'};
  color: ${p=>p.type==='spicer' ? '#000' : '#083b44'};
  font-weight:700;
  margin-right:.4rem;
`;

const EmptyState = styled.div`
  padding:2rem;
  text-align:center;
  color:#666;
`;

const AdminProductsPage: React.FC = () => {
  const { products, updateProduct } = useAdmin();
  const [brandFilter, setBrandFilter] = useState<'all'|'spicer'|'main'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        if (brandFilter === 'spicer') return p.brand === 'spicer';
        if (brandFilter === 'main') return !p.brand || p.brand !== 'spicer';
        return true;
      })
      .filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (p.name||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q);
      });
  }, [products, brandFilter, search]);

  const togglePopular = async (id: string, current?: boolean) => {
    try { await updateProduct(id, { isPopular: !current }); } catch(e) { console.error(e); }
  };

  return (
    <Container>
      <Heading>Товары (все бренды)</Heading>
      <FiltersBar>
        <FilterButton active={brandFilter==='all'} onClick={()=>setBrandFilter('all')}>Все</FilterButton>
        <FilterButton active={brandFilter==='spicer'} onClick={()=>setBrandFilter('spicer')}>Spicer</FilterButton>
        <FilterButton active={brandFilter==='main'} onClick={()=>setBrandFilter('main')}>Основные</FilterButton>
        <input
          placeholder="Поиск..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{padding:'.6rem .8rem',border:'1px solid #ccc',borderRadius:8,flex:'1 1 220px'}}
        />
      </FiltersBar>
      {filtered.length === 0 ? (
        <EmptyState>Нет товаров для отображения</EmptyState>
      ) : (
        <div style={{overflowX:'auto', maxHeight:'70vh'}}>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Название</Th>
                <Th>Бренд</Th>
                <Th>Категория</Th>
                <Th>Цена</Th>
                <Th>Популярное</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <Td style={{maxWidth:160,wordBreak:'break-all'}}>{p.id}</Td>
                  <Td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      { (p.image || p.imageUrl) && <img src={p.image || p.imageUrl} alt={p.name} style={{width:40,height:40,objectFit:'cover',borderRadius:8}} /> }
                      <div>
                        <div style={{fontWeight:600}}>{p.name}</div>
                        <div style={{fontSize:'.65rem',opacity:.6}}>{p.volume || ''}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge type={p.brand==='spicer' ? 'spicer' : 'other'}>{p.brand==='spicer' ? 'SPICER' : 'MAIN'}</Badge>
                  </Td>
                  <Td>{p.category || '-'}</Td>
                  <Td>{p.price} ₴</Td>
                  <Td>
                    <PopularToggle active={!!p.isPopular} onClick={()=>togglePopular(p.id, p.isPopular)}> {p.isPopular ? 'YES' : 'SET'} </PopularToggle>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AdminProductsPage;
