import React, { useState } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../contexts/AdminContext';
import { storageService, STORAGE_PATHS } from '../firebase/storageService';
import { FiUpload, FiTrash2, FiVideo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  flex: 1;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 2px solid #e9ecef;
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Thumb = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding-bottom: 100%;
`;

const Img = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoThumb = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(231,76,60,0.9);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Info = styled.p`
  color: #6c757d;
`;

const CategoryShowcaseManager: React.FC = () => {
  const { categories, updateCategory } = useAdmin();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categories?.[0]?.id || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null;

  const toggleShowcase = async () => {
    if (!selectedCategory) return;
    try {
      await updateCategory(selectedCategory.id, { showInShowcase: !selectedCategory.showInShowcase });
      toast.success(`Витрина ${!selectedCategory.showInShowcase ? 'включена' : 'выключена'} для ${selectedCategory.name}`);
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при обновлении статуса витрины');
    }
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !selectedCategory) return;

    setIsUploading(true);
    try {
  // Some projects have stricter rules for custom folders; upload into the existing
  // product gallery path which already works for admin uploads.
  const uploadPath = STORAGE_PATHS.PRODUCT_GALLERY || `${STORAGE_PATHS.CATEGORIES}/showcase`;
  const urls = await storageService.uploadMultipleFiles(files, uploadPath);

      const newAlbum = [ ...(selectedCategory.albumImages || []), ...urls];
      await updateCategory(selectedCategory.id, { albumImages: newAlbum });
      toast.success('Изображения добавлены в альбом');
    } catch (err) {
      console.error('Ошибка при загрузке изображений:', err);
      const msg = (err as any)?.message || String(err);
      toast.error(`Ошибка при загрузке: ${msg}`);
    } finally {
      setIsUploading(false);
      // clear input
      if (e.target) e.target.value = '';
    }
  };

  const handleVideos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !selectedCategory) return;

    // Проверяем размер каждого файла (максимум 10 MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const oversized = files.filter(f => f.size > MAX_SIZE);
    if (oversized.length > 0) {
      const sizes = oversized.map(f => `${f.name}: ${(f.size / 1024 / 1024).toFixed(1)} MB`).join(', ');
      toast.error(`Видео слишком большие (макс 10 MB): ${sizes}. Сожмите их перед загрузкой.`);
      if (e.target) e.target.value = '';
      return;
    }

    // Проверяем MIME тип
    const invalidTypes = files.filter(f => !f.type.startsWith('video/'));
    if (invalidTypes.length > 0) {
      toast.error(`Некоторые файлы не являются видео: ${invalidTypes.map(f => f.name).join(', ')}`);
      if (e.target) e.target.value = '';
      return;
    }

    setIsUploadingVideo(true);
    try {
      // Видеофайлы загружаем в отдельную папку категорий, потому что
      // правила для products/gallery разрешают только image/* и блокируют видео.
      const uploadPath = STORAGE_PATHS.CATEGORY_SHOWCASE_VIDEOS;
      const urls = await storageService.uploadMultipleFiles(files, uploadPath);
      const newVideos = [ ...(selectedCategory.albumVideos || []), ...urls];
      await updateCategory(selectedCategory.id, { albumVideos: newVideos });
      toast.success('Видео добавлены в альбом');
    } catch (err) {
      console.error('Ошибка при загрузке видео:', err);
      const msg = (err as any)?.message || String(err);
      toast.error(`Ошибка при загрузке видео: ${msg}`);
    } finally {
      setIsUploadingVideo(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    if (!selectedCategory) return;
    const url = selectedCategory.albumImages?.[index];
    if (!url) return;

    if (!window.confirm('Удалить изображение из альбома?')) return;

    try {
      if (storageService.isFirebaseStorageURL(url)) {
        await storageService.deleteFile(url);
      }
    } catch (err) {
      console.warn('Ошибка удаления из storage, продолжим обновлять категорию', err);
    }

    const newAlbum = (selectedCategory.albumImages || []).filter((_, i) => i !== index);
    await updateCategory(selectedCategory.id, { albumImages: newAlbum });
    toast.success('Изображение удалено');
  };

  const handleRemoveVideo = async (index: number) => {
    if (!selectedCategory) return;
    const url = selectedCategory.albumVideos?.[index];
    if (!url) return;

    if (!window.confirm('Удалить видео из альбома?')) return;

    try {
      if (storageService.isFirebaseStorageURL(url)) {
        await storageService.deleteFile(url);
      }
    } catch (err) {
      console.warn('Ошибка удаления видео из storage, продолжим обновлять категорию', err);
    }

    const newVideos = (selectedCategory.albumVideos || []).filter((_, i) => i !== index);
    await updateCategory(selectedCategory.id, { albumVideos: newVideos });
    toast.success('Видео удалено');
  };

  return (
    <Container>
      <Row>
        <Select value={selectedCategoryId || ''} onChange={e => setSelectedCategoryId(e.target.value || null)}>
          <option value="">-- Выберите категорию --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        <UploadLabel>
          <FiUpload />
          <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} disabled={!selectedCategory || isUploading} />
          {isUploading ? 'Загрузка...' : 'Загрузить'}
        </UploadLabel>

        <UploadLabel>
          <FiVideo />
          <input type="file" accept="video/*" multiple onChange={handleVideos} style={{ display: 'none' }} disabled={!selectedCategory || isUploadingVideo} />
          {isUploadingVideo ? 'Загрузка видео...' : 'Загрузить видео'}
        </UploadLabel>
        
        <UploadLabel as="button" style={{ background: selectedCategory?.showInShowcase ? 'linear-gradient(135deg,#27ae60 0%,#2ecc71 100%)' : undefined }} onClick={(e) => { e.preventDefault(); toggleShowcase(); }}>
          {selectedCategory?.showInShowcase ? 'Снять с витрины' : 'Показать в витрине'}
        </UploadLabel>
      </Row>

      {!selectedCategory && <Info>Выберите категорию, чтобы управлять её витриной.</Info>}

      {selectedCategory && (
        <>
          <Info>Альбом: {(selectedCategory.albumImages || []).length} изображений • {(selectedCategory.albumVideos || []).length} видео</Info>

          <Gallery>
            {(selectedCategory.albumImages || []).map((url, idx) => (
              <Thumb key={idx}>
                <Img src={url} alt={`album-${idx}`} />
                <RemoveBtn onClick={() => handleRemove(idx)} title="Удалить">
                  <FiTrash2 />
                </RemoveBtn>
              </Thumb>
            ))}
            {(selectedCategory.albumVideos || []).map((url, idx) => (
              <Thumb key={`v-${idx}`}>
                <VideoThumb src={url} muted playsInline autoPlay loop preload="metadata" />
                <RemoveBtn onClick={() => handleRemoveVideo(idx)} title="Удалить видео">
                  <FiTrash2 />
                </RemoveBtn>
              </Thumb>
            ))}
          </Gallery>
        </>
      )}
    </Container>
  );
};

export default CategoryShowcaseManager;
