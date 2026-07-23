type UploadProgressCallback = (progress: number) => void;

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
const UPLOAD_TIMEOUT_MS = 90_000;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 25 * 1024 * 1024;

const IMAGE_MIME_TYPES = new Set([
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp'
]);

const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm'
]);

const IMAGE_EXTENSIONS = new Set(['avif', 'gif', 'jpeg', 'jpg', 'png', 'webp']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm']);

export type MediaFileKind = 'image' | 'video';

const getFileExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop();
  return extension ? extension.toLowerCase() : '';
};

export const getMediaFileKind = (file: Pick<File, 'name' | 'type'>): MediaFileKind | null => {
  const mimeType = file.type.toLowerCase();
  const extension = getFileExtension(file.name);

  if (IMAGE_MIME_TYPES.has(mimeType) || (!mimeType && IMAGE_EXTENSIONS.has(extension))) {
    return 'image';
  }

  if (VIDEO_MIME_TYPES.has(mimeType) || (!mimeType && VIDEO_EXTENSIONS.has(extension))) {
    return 'video';
  }

  return null;
};

export const validateMediaFile = (
  file: Pick<File, 'name' | 'size' | 'type'>
): MediaFileKind => {
  const mediaKind = getMediaFileKind(file);

  if (!mediaKind) {
    throw new Error('Підтримуються зображення JPG, PNG, WebP, AVIF, GIF та відео MP4, WebM');
  }

  const maxSize = mediaKind === 'image' ? MAX_IMAGE_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;
  if (file.size <= 0 || file.size > maxSize) {
    const maxSizeMb = Math.round(maxSize / 1024 / 1024);
    throw new Error(`Максимальний розмір ${mediaKind === 'image' ? 'зображення' : 'відео'}: ${maxSizeMb} МБ`);
  }

  return mediaKind;
};

const getCloudinaryUploadUrl = (): string => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary не налаштований. Додайте REACT_APP_CLOUDINARY_CLOUD_NAME та REACT_APP_CLOUDINARY_UPLOAD_PRESET'
    );
  }

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
};

const getUploadFolder = (path: string): string => {
  const normalizedPath = path
    .split('/')
    .map(segment => segment.replace(/[^a-zA-Z0-9_-]/g, ''))
    .filter(Boolean)
    .join('/');

  if (!normalizedPath) {
    throw new Error('Не вказано папку для завантаження');
  }

  return `dreamshop/${normalizedPath}`;
};

const uploadToCloudinary = (
  file: File,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  validateMediaFile(file);

  const uploadUrl = getCloudinaryUploadUrl();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', getUploadFolder(path));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = UPLOAD_TIMEOUT_MS;

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
      } catch {
        reject(new Error('Cloudinary повернув некоректну відповідь'));
      }
    };

    xhr.onerror = () => reject(new Error('Не вдалося підключитися до Cloudinary'));
    xhr.ontimeout = () => reject(new Error('Час завантаження файлу вичерпано'));
    xhr.onabort = () => reject(new Error('Завантаження файлу скасовано'));
    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  });
};

export const storageService = {
  async uploadFile(
    file: File,
    path: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    return uploadToCloudinary(file, path, onProgress);
  },

  async uploadMultipleFiles(
    files: File[],
    path: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<string[]> {
    files.forEach(validateMediaFile);

    return Promise.all(
      files.map((file, index) =>
        this.uploadFile(file, path, progress => onProgress?.(index, progress))
      )
    );
  },

  async deleteFile(url: string): Promise<void> {
    if (!url) return;

    console.warn(
      'Фізичне видалення медіа очікує серверний signed endpoint.',
      url
    );
  },

  async deleteMultipleFiles(urls: string[]): Promise<void> {
    await Promise.all(urls.map(url => this.deleteFile(url)));
  },

  isLegacyFirebaseStorageUrl(url: string): boolean {
    return url.includes('firebasestorage.googleapis.com') || url.includes('firebase.storage');
  },

  isCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com');
  }
};

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
