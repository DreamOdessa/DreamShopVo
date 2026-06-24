type UploadProgressCallback = (progress: number) => void;

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';

const getCloudinaryUploadUrl = () => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary не настроен. Добавьте REACT_APP_CLOUDINARY_CLOUD_NAME и REACT_APP_CLOUDINARY_UPLOAD_PRESET в .env'
    );
  }

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
};

const getUploadFolder = (path: string) => `dreamshop/${path}`.replace(/\/+/g, '/');

const uploadToCloudinary = (
  file: File,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  const uploadUrl = getCloudinaryUploadUrl();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', getUploadFolder(path));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = event => {
      if (event.lengthComputable && onProgress) {
        onProgress((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText || '{}');

        if (xhr.status >= 200 && xhr.status < 300 && response.secure_url) {
          resolve(response.secure_url);
          return;
        }

        reject(new Error(response.error?.message || `Cloudinary upload failed (${xhr.status})`));
      } catch (error) {
        reject(error);
      }
    };

    xhr.onerror = () => reject(new Error('Не удалось подключиться к Cloudinary'));
    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  });
};

/**
 * Сервис для работы с медиа-хранилищем.
 * Сейчас используется Cloudinary unsigned upload, чтобы не хранить секретные ключи в браузере.
 */
export const storageService = {
  async uploadFile(
    file: File,
    path: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    try {
      return await uploadToCloudinary(file, path, onProgress);
    } catch (error) {
      console.error('Ошибка загрузки файла в Cloudinary:', error);
      throw error;
    }
  },

  async uploadMultipleFiles(
    files: File[],
    path: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<string[]> {
    return Promise.all(
      files.map((file, index) =>
        this.uploadFile(file, path, progress => onProgress?.(index, progress))
      )
    );
  },

  async deleteFile(url: string): Promise<void> {
    if (!url) return;

    console.warn(
      'Удаление файлов из Cloudinary с клиента отключено: для этого нужен серверный signed-запрос.',
      url
    );
  },

  async deleteMultipleFiles(urls: string[]): Promise<void> {
    await Promise.all(urls.map(url => this.deleteFile(url)));
  },

  async getFileURL(path: string): Promise<string> {
    return path;
  },

  isFirebaseStorageURL(url: string): boolean {
    return url.includes('firebasestorage.googleapis.com') || url.includes('firebase.storage');
  },

  isCloudinaryURL(url: string): boolean {
    return url.includes('res.cloudinary.com');
  }
};

/**
 * Папки для хранения медиа.
 * Название оставлено прежним, чтобы не менять импорты в компонентах.
 */
export const STORAGE_PATHS = {
  PRODUCTS: 'products',
  PRODUCT_MAIN_IMAGES: 'products/main',
  PRODUCT_HOVER_IMAGES: 'products/hover',
  PRODUCT_GALLERY: 'products/gallery',
  CATEGORIES: 'categories',
  CATEGORY_SHOWCASE_VIDEOS: 'categories/showcase-videos',
  USERS: 'users',
  ORDERS: 'orders',
  BACKGROUNDS: 'backgrounds'
} as const;
