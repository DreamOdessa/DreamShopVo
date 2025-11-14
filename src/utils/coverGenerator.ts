import { storageService, STORAGE_PATHS } from '../firebase/storageService'; // Сервіс сховища

type CoverOptions = { // Налаштування
  width?: number;
  height?: number;
  bgColor?: string;
  frameColor?: string;
  titleColor?: string;
  subtitle?: string;
};

/**
 * Генерирует обложку (canvas) в винтажном стиле и возвращает File
 */
export async function generateCoverFile(flavor: string, opts: CoverOptions = {}): Promise<File> { // Генерація файлу
  const width = opts.width ?? 1024; // 2:3 пропорция по умолчанию 1024x1536
  const height = opts.height ?? 1536;
  const bgColor = opts.bgColor ?? '#f6f1e5';
  const frameColor = opts.frameColor ?? '#2e8a95';
  const titleColor = opts.titleColor ?? '#5b5b5b';
  const subtitle = opts.subtitle ?? '';

  const canvas = document.createElement('canvas'); // Canvas
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D; // гарантуємо 2D контекст

  // Фон пергамент
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Текстура шум
  const noiseDensity = 0.05;
  const noise = ctx.createImageData(width, height);
  for (let i = 0; i < noise.data.length; i += 4) {
    const r = Math.random() < noiseDensity ? 230 + Math.random() * 20 : 0;
    noise.data[i] = r; // R
    noise.data[i + 1] = r; // G
    noise.data[i + 2] = r; // B
    noise.data[i + 3] = Math.random() < noiseDensity ? 35 : 0; // A
  }
  ctx.putImageData(noise, 0, 0);

  // Декор рамка
  const margin = Math.floor(Math.min(width, height) * 0.06);
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  ctx.lineWidth = 2;
  const inset = margin + 18;
  ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);

  // Кути завитки
  function cornerSwirl(x: number, y: number, dirX: 1 | -1, dirY: 1 | -1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dirX, dirY);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(40, 15, 70, 45, 90, 90);
    ctx.bezierCurveTo(65, 75, 35, 70, 0, 90);
    ctx.stroke();
    ctx.restore();
  }
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 3;
  cornerSwirl(inset + 14, inset + 14, 1, 1);
  cornerSwirl(width - inset - 14, inset + 14, -1, 1);
  cornerSwirl(inset + 14, height - inset - 14, 1, -1);
  cornerSwirl(width - inset - 14, height - inset - 14, -1, -1);

  // Центральна розетка
  const cx = width / 2;
  const cy = height * 0.42;
  const r = Math.min(width, height) * 0.18;
  const roseBg = '#f0ebe1';
  ctx.fillStyle = roseBg;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Значок смаку
  ctx.fillStyle = '#934c4c';
  ctx.font = `${Math.floor(r * 0.9)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const glyph = pickGlyph(flavor);
  ctx.fillText(glyph, cx, cy + 4);

  // Заголовок смаку
  ctx.fillStyle = titleColor;
  ctx.font = `bold ${Math.floor(width * 0.08)}px "Georgia", "Times New Roman", serif`;
  const title = flavor.toUpperCase();
  ctx.fillText(title, cx, height * 0.82);

  // Підзаголовок
  if (subtitle) {
    ctx.fillStyle = '#7b7b7b';
    ctx.font = `${Math.floor(width * 0.035)}px "Georgia", serif`;
    ctx.fillText(subtitle, cx, height * 0.88);
  }

  const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b as Blob), 'image/webp', 0.95));
  const fileName = `${Date.now()}_${slugify(flavor)}.webp`;
  const file = new File([blob], fileName, { type: 'image/webp' });
  return file;
}

/**
 * Генерирует и загружает обложку. Возвращает downloadURL.
 */
export async function generateAndUploadCover(flavor: string): Promise<string> { // Генерація + upload
  const file = await generateCoverFile(flavor);
  const url = await storageService.uploadFile(file, STORAGE_PATHS.PRODUCT_MAIN_IMAGES);
  return url;
}

function slugify(s: string) { // Слаг
  return s
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

function pickGlyph(flavor: string): string { // Гліф
  const f = flavor.toLowerCase();
  // Простейшее сопоставление вкусов с эмодзи (заглушка вместо иллюстрации)
  if (/(троянда|роза)/.test(f)) return '🌹';
  if (/(ваніль|ваниль)/.test(f)) return '🌼';
  if (/(лимон|лайм)/.test(f)) return '🍋';
  if (/(апельсин|оранж|цитрус)/.test(f)) return '🍊';
  if (/(яблук|яблок)/.test(f)) return '🍎';
  if (/(вишн|череш)/.test(f)) return '🍒';
  if (/(малина|клубник|суниц)/.test(f)) return '🍓';
  if (/(чорниц|черник|голубик)/.test(f)) return '🫐';
  if (/(персик|абрикос)/.test(f)) return '🍑';
  if (/(ананас)/.test(f)) return '🍍';
  if (/(кокос)/.test(f)) return '🥥';
  if (/(мята|м\u2019ята|м\u02bcята)/.test(f)) return '🌿';
  if (/(карамел)/.test(f)) return '🍯';
  return '⭐';
}
