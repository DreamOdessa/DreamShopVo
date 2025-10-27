import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject
} from 'firebase/storage';
import { storage } from './config';

/**
 * Сервис для работы с Firebase Storage
 */
export const storageService = {
  /**
   * Загрузить файл в Firebase Storage
   * @param file - файл для загрузки
   * @param path - путь в storage (например, 'products/image.jpg')
   * @param onProgress - callback для отслеживания прогресса (0-100)
   * @returns URL загруженного файла
   */
  async uploadFile(
    file: File, 
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Создаем уникальное имя файла с timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const fullPath = `${path}/${fileName}`;
      
      const storageRef = ref(storage, fullPath);
      
      // Если нужен прогресс, используем uploadBytesResumable
      if (onProgress) {
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              console.error('Ошибка загрузки файла:', error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } else {
        // Простая загрузка без отслеживания прогресса
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      }
    } catch (error) {
      console.error('Ошибка загрузки файла в Firebase Storage:', error);
      throw error;
    }
  },

  /**
   * Загрузить несколько файлов
   * @param files - массив файлов
   * @param path - базовый путь в storage
   * @param onProgress - callback для отслеживания прогресса каждого файла
   * @returns массив URL загруженных файлов
   */
  async uploadMultipleFiles(
    files: File[],
    path: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const progressCallback = onProgress 
        ? (progress: number) => onProgress(index, progress)
        : undefined;
      
      return this.uploadFile(file, path, progressCallback);
    });

    return Promise.all(uploadPromises);
  },

  /**
   * Удалить файл из Firebase Storage
   * @param url - URL файла для удаления
   */
  async deleteFile(url: string): Promise<void> {
    try {
      // Извлекаем путь из URL
      const urlObj = new URL(url);
      const path = decodeURIComponent(urlObj.pathname);
      
      // Убираем /o/ из начала пути и параметры из конца
      const pathMatch = path.match(/\/o\/(.+?)\?/);
      if (!pathMatch) {
        throw new Error('Не удалось извлечь путь из URL');
      }
      
      const filePath = pathMatch[1];
      const storageRef = ref(storage, filePath);
      
      await deleteObject(storageRef);
      console.log('Файл успешно удален:', filePath);
    } catch (error) {
      console.error('Ошибка удаления файла:', error);
      throw error;
    }
  },

  /**
   * Удалить несколько файлов
   * @param urls - массив URL файлов для удаления
   */
  async deleteMultipleFiles(urls: string[]): Promise<void> {
    const deletePromises = urls.map(url => this.deleteFile(url));
    await Promise.all(deletePromises);
  },

  /**
   * Получить URL из пути в storage
   * @param path - путь в storage
   * @returns URL файла
   */
  async getFileURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  },

  /**
   * Проверить, является ли URL из Firebase Storage
   * @param url - URL для проверки
   * @returns true если URL из Firebase Storage
   */
  isFirebaseStorageURL(url: string): boolean {
    return url.includes('firebasestorage.googleapis.com') || url.includes('firebase.storage');
  }
};

/**
 * Пути для хранения медиа
 */
export const STORAGE_PATHS = {
  PRODUCTS: 'products',
  PRODUCT_MAIN_IMAGES: 'products/main',
  PRODUCT_HOVER_IMAGES: 'products/hover',
  PRODUCT_GALLERY: 'products/gallery',
  CATEGORIES: 'categories',
  USERS: 'users',
  ORDERS: 'orders',
  BACKGROUNDS: 'backgrounds'
} as const;

