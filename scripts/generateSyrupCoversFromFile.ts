// @ts-nocheck
/**
 * Генерация обложек для сиропов из локального списка (шаблон сиропов.js)
 * - Размер: 1000x1000
 * - Формат: WebP (quality ~0.85)
 * - Стиль: пергамент + бирюзовая рамка + простые завитки + название вкуса
 * - Иконка по вкусу: простой emoji-мэппинг (можно заменить на SVG позже)
 * - Загрузка в Firebase Storage: products/covers/{id}_cover.webp
 *
 * Запуск:
 *   npx ts-node scripts/generateSyrupCoversFromFile.ts
 */

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Canvas, FontLibrary } from 'skia-canvas';
import { defaultCoverStyle } from './coverStyleConfig';
import fs from 'fs';
import path from 'path';

// Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE',
  authDomain: 'dreamshop-odessa.firebaseapp.com',
  projectId: 'dreamshop-odessa',
  storageBucket: 'dreamshop-odessa.appspot.com', // исправлено: стандартный домен appspot.com
  messagingSenderId: '941215601569',
  appId: '1:941215601569:web:a4e5c1bb2892892bbc31e0',
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Fonts (optional, игнорируем ошибки)
try {
  FontLibrary.use('Cinzel', [
    'C:/Windows/Fonts/Cinzel-Regular.ttf',
    'C:/Windows/Fonts/Cinzel-Bold.ttf'
  ]);
} catch {}
try {
  FontLibrary.use('Merriweather', [
    'C:/Windows/Fonts/merriweather-regular.ttf',
    'C:/Windows/Fonts/merriweather-bold.ttf'
  ]);
} catch {}

// Emoji mapping (простая заглушка)
const emojiMap: Record<string, string> = {
  apricot: '🍑', peach: '🍑', mango: '🥭', 
  strawberry: '🍓', strawberry_full: '🍓', raspberry: '🍓', cranberry: '🫐', 
  blueberry: '🫐', black_currant: '🫐', blackberry: '🫐', forest_berry: '🫐',
  lemon: '🍋', lime: '🍋', grapefruit: '🍊', orange: '🍊', tangerine: '🍊', 
  pear: '🍐', apple_pie: '🍎', green_apple: '🍏', quince: '🍏', 
  pineapple: '🍍', coconut: '🥥', kiwi: '🥝', pomegranate: '🍎',
  basil: '🌿', mint: '🌿', mojito_mint: '🌿', tarragon: '🌿', lemongrass: '🌿',
  lavender: '💠', violet: '💠', rose: '🌹', jasmine: '🌼', elderflower: '🌼',
  caramel: '🍯', salted_caramel: '🍯', honey: '🍯', chocolate: '🍫', vanilla: '🌼',
  popcorn: '🍿', cream_soda: '🥤', coffee: '☕', black_tea: '🍵', green_tea: '🍵',
  rum: '🥃', irish_cream: '🥃', baileys: '🥃', amaretto: '🥃', bitter: '🥃'
};

function pickEmoji(flavorTag: string, name: string) {
  if (flavorTag && emojiMap[flavorTag]) return emojiMap[flavorTag];
  const k = (flavorTag || name || '').toLowerCase();
  for (const [key, v] of Object.entries(emojiMap)) {
    if (k.includes(key)) return v;
  }
  return '⭐';
}

function drawPaper(ctx, W, H) {
  const s = defaultCoverStyle;
  ctx.fillStyle = s.parchmentColor;
  ctx.fillRect(0, 0, W, H);
  const img = ctx.createImageData(W, H);
  for (let i = 0; i < W * H * 4; i += 4) {
    const n = 238 + Math.floor(Math.random() * 14);
    img.data[i] = n; img.data[i + 1] = n; img.data[i + 2] = n - 4; img.data[i + 3] = 255;
  }
  ctx.globalAlpha = s.parchmentNoiseOpacity; ctx.putImageData(img, 0, 0); ctx.globalAlpha = 1;
}

function drawFrame(ctx, W, H, frameColor = defaultCoverStyle.framePrimaryColor) {
  const s = defaultCoverStyle;
  ctx.strokeStyle = frameColor; ctx.lineWidth = s.frameOuterWidth;
  ctx.strokeRect(s.frameMargins.outer, s.frameMargins.outer, W - s.frameMargins.outer * 2, H - s.frameMargins.outer * 2);
  ctx.lineWidth = s.frameInnerWidth;
  ctx.strokeRect(s.frameMargins.inner, s.frameMargins.inner, W - s.frameMargins.inner * 2, H - s.frameMargins.inner * 2);
  if (!s.swirlEnabled) return;
  ctx.strokeStyle = frameColor; ctx.lineWidth = 3;
  const swirl = (ox, oy, k=1) => {
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.bezierCurveTo(ox + 34*k, oy + 12*k, ox + 54*k, oy + 52*k, ox + 12*k, oy + 76*k);
    ctx.bezierCurveTo(ox + 54*k, oy + 52*k, ox + 64*k, oy + 96*k, ox + 20*k, oy + 120*k);
    ctx.stroke();
  };
  swirl(70, 70, 1);
  ctx.save(); ctx.translate(W-70, 70); ctx.scale(-1,1); swirl(0,0,1); ctx.restore();
  ctx.save(); ctx.translate(70, H-70); ctx.scale(1,-1); swirl(0,0,1); ctx.restore();
  ctx.save(); ctx.translate(W-70, H-70); ctx.scale(-1,-1); swirl(0,0,1); ctx.restore();
}

async function renderCover(item): Promise<Buffer> {
  const s = defaultCoverStyle;
  const W = s.canvasSize, H = s.canvasSize;
  const canvas = new Canvas(W, H);
  const ctx = canvas.getContext('2d');

  drawPaper(ctx, W, H);
  drawFrame(ctx, W, H, s.framePrimaryColor);

  // Центральный круг-подложка под эмодзи
  const R = s.emojiCircleRadius; const CX = W/2; const CY = H/2 - 80;
  ctx.fillStyle = s.emojiCircleFill;
  ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = s.emojiCircleStroke; ctx.lineWidth = 2; ctx.stroke();

  // Эмодзи
  const emoji = pickEmoji(item.flavorTag, item.name);
  ctx.font = s.emojiFont;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(emoji, CX, CY + s.emojiYOffset);

  // Название
  ctx.fillStyle = s.titleColor;
  ctx.font = s.titleFont;
  const title = (item.name || '').toUpperCase();
  ctx.fillText(title, W/2, s.titleY);

  return await canvas.toBuffer('image/webp', { quality: s.quality });
}

async function upload(buffer: Buffer, id: string): Promise<string> {
  const filename = `${id}_cover.webp`;
  const storageRef = ref(storage, `products/covers/${filename}`);
  await uploadBytes(storageRef, buffer, { contentType: 'image/webp' });
  return await getDownloadURL(storageRef);
}

function readSyrupsList() {
  const cleanPath = path.resolve(process.cwd(), 'data/syrups.json');
  if (fs.existsSync(cleanPath)) {
    try {
      const raw = fs.readFileSync(cleanPath, 'utf-8');
      const arr = JSON.parse(raw);
      console.log(`📄 Используется data/syrups.json (${arr.length} записей)`);
      return arr;
    } catch (e) {
      console.error('Не удалось распарсить data/syrups.json. Проверьте формат JSON.');
      throw e;
    }
  }
  // Fallback на старый файл (может быть проблемным)
  const legacyPath = path.resolve(process.cwd(), 'логотипы фоны сайта/шаблон сиропов.js');
  const legacyRaw = fs.readFileSync(legacyPath, 'utf-8').trim();
  try {
    if (legacyRaw.startsWith('[')) {
      return JSON.parse(legacyRaw);
    }
    // Попытка авто-обернуть в массив если это список объектов без []
    const wrapped = `[${legacyRaw.endsWith(',') ? legacyRaw.slice(0, -1) : legacyRaw}]`;
    return JSON.parse(wrapped);
  } catch (e) {
    console.error('Ошибка парсинга legacy файла. Рекомендуется создать data/syrups.json.');
    throw e;
  }
}

async function main() {
  const all = readSyrupsList();
  const localMode = process.argv.includes('--local');
  if (localMode) {
    console.log('🖼  Local mode: файлы будут сохранены, без загрузки в Storage');
    const outDir = path.resolve(process.cwd(), 'public/generated_covers');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  }
  // Парсим аргумент --subset=rose,strawberry,... (можно flavorTag, id или часть name)
  const subsetArg = process.argv.find(a => a.startsWith('--subset='));
  let list = all;
  if (subsetArg) {
    const rawTokens = subsetArg.replace('--subset=','').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    list = all.filter(item => {
      const id = (item.id||'').toLowerCase();
      const tag = (item.flavorTag||'').toLowerCase();
      const name = (item.name||'').toLowerCase();
      return rawTokens.some(tok => id.includes(tok) || tag.includes(tok) || name.includes(tok));
    });
    console.log(`⚙️ Фильтр subset активен (${rawTokens.length} токенов). Отобрано ${list.length} из ${all.length}.`);
  }
  console.log(`Найдено сиропов для генерации: ${list.length}`);
  let i = 0;
  for (const item of list) {
    try {
      const buf = await renderCover(item);
      let url: string = '';
      if (localMode) {
        const outPath = path.resolve(process.cwd(), `public/generated_covers/${item.id}_cover.webp`);
        fs.writeFileSync(outPath, buf);
        url = `local:${outPath}`;
      } else {
        url = await upload(buf, item.id);
      }
      i++;
      console.log(`✅ ${i}/${list.length} ${item.id} → ${url}`);
    } catch (e) {
      console.error(`❌ Ошибка для ${item.id}:`, e);
    }
  }
  console.log('🎉 Готово');
}

main().catch(e => { console.error(e); process.exit(1); });
