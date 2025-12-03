import React, { useEffect, useState } from 'react';
import { siteSettingsService } from '../../firebase/services';
import BugReportsPanel from '../../components/admin/BugReportsPanel';

const AdminSettingsPage: React.FC = () => {
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await siteSettingsService.getMain();
        if (data?.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
        setInitialLoaded(true);
      } catch (e) {
        console.error('Ошибка загрузки настроек', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await siteSettingsService.updateMain({ heroSubtitle });
      alert('Сохранено');
    } catch (e) {
      console.error(e);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !initialLoaded) return <div style={{padding:'2rem'}}>Загрузка настроек...</div>;

  return (
    <div style={{padding:'2rem',maxWidth:800}}>
      <h2>⚙ Настройки сайта</h2>
      <label style={{display:'block',fontWeight:600,margin:'1rem 0 0.5rem'}}>Текст приветствия (Hero Subtitle)</label>
      <textarea
        value={heroSubtitle}
        onChange={e => setHeroSubtitle(e.target.value)}
        rows={5}
        style={{width:'100%',padding:'1rem',borderRadius:'12px',border:'1px solid #ccc',resize:'vertical'}}
        placeholder="Введите текст..."
      />
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          marginTop:'1rem',
          background:'linear-gradient(135deg,#4dd0e1 0%,#26c6da 50%,#00acc1 100%)',
          color:'#fff',
          border:'none',
          padding:'0.9rem 1.6rem',
          borderRadius:'28px',
          fontWeight:600,
          cursor:'pointer'
        }}
      >{saving? 'Сохранение...' : 'Сохранить'}</button>
      
      {/* Bug Reports Management Panel */}
      <BugReportsPanel />
    </div>
  );
};

export default AdminSettingsPage;
