// @ts-nocheck
/**
 * Генерация обложек для сиропов в едином стиле (винтажная карточка)
 * - Рендер PNG 768x1152 через skia-canvas
 * - Загрузка в Firebase Storage
 * - Обновление product.images = [cover, COMMON_LOGO]
 * Запуск: npx ts-node scripts/generateCovers.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Canvas, FontLibrary } from 'skia-canvas';

const firebaseConfig = {
  apiKey: 'AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE',
  authDomain: 'dreamshop-odessa.firebaseapp.com',
  projectId: 'dreamshop-odessa',
  storageBucket: 'dreamshop-odessa.firebasestorage.app',
  messagingSenderId: '941215601569',
  appId: '1:941215601569:web:a4e5c1bb2892892bbc31e0',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Общий логотип (второе изображение при hover)
const COMMON_LOGO = 'https://firebasestorage.googleapis.com/v0/b/dreamshop-odessa.firebasestorage.app/o/products%2Fgallery%2F%D0%B4%D0%BB%D1%8F%20%D0%B2%D1%81%D0%B5%D1%85%20%D1%81%D0%B8%D1%80%D0%BE%D0%BF%D0%BE%D0%B2.JPG?alt=media&token=aaba12ef-17f6-42b1-9291-799bcebcdb7b';

// Регистрируем шрифты (используем системные безопасные, если нет — падение на default)
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

// Сопоставление вкусов к эмодзи (упрощённый визуальный маркер)
const flavorEmoji: Record<string, string> = {
  'абрикос': '🍑',
  'груша': '🍐',
  'айва': '🍏',
  'вишня': '🍒',
  'диня': '🍈',
  'ананас': '🍍',
  'апельсин': '🍊',
  'ожина': '🫐',
  'жасмин': '🌼',
  'кавун': '🍉',
  'суниця': '🍓',
  'базилік': '🌿',
  'імбир': '🫚',
  'банан': '🍌',
  'ірландський крем': '🥃',
  'барбарис': '🌺',
  'кактус': '🌵',
  'карамель': '🍯',
  'бергамот': '🍋',
  'ківі': '🥝',
  'клен': '🍁',
  'бузина': '🌸',
  'полуниця': '🍓',
  'ваніль': '🌼',
  'журавлина': '🫐',
  'вишня': '🍒',
  'кокос': '🥥',
  'гранат': '🍎',
  'грейпфрут': '🍊',
  'кориця': '🌿',
  'лайм': '🍋',
  'ром': '🥃',
  'лимон': '🍋',
  'лаванда': '💠',
  'троянда': '🌹',
  'малина': '🍓',
  'чорниця': '🫐',
  'чорна смородина': '🫐',
  'мигдаль': '🌰',
  'фісташка': '🌰',
  'манго': '🥭',
  'маркуйя': '🥭',
  'личі': '🍒',
  'персик': '🍑',
  'яблуко': '🍎'
};

function pickEmoji(flavor: string): string {
  const key = flavor.toLowerCase();
  for (const k of Object.keys(flavorEmoji)) {
    if (key.includes(k)) return flavorEmoji[k];
  }
  return '🌿';
}

function drawPaperNoise(ctx, w, h) {
  const imgData = ctx.createImageData(w, h);
  for (let i = 0; i < w * h * 4; i += 4) {
    const n = 240 + Math.floor(Math.random() * 16); // легкий шум
    imgData.data[i] = n;
    imgData.data[i + 1] = n;
    imgData.data[i + 2] = n - 4;
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
}

function drawFrame(ctx, w, h) {
  // фон
  ctx.fillStyle = '#efe7d6';
  ctx.fillRect(0, 0, w, h);

  // лёгкая текстура поверх
  ctx.globalAlpha = 0.08;
  drawPaperNoise(ctx, w, h);
  ctx.globalAlpha = 1;

  // внешняя рамка
  ctx.strokeStyle = '#2b8da2';
  ctx.lineWidth = 14;
  ctx.strokeRect(22, 22, w - 44, h - 44);

  // внутренняя рамка
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  // декоративные углы (простые завитки-узоры)
  ctx.strokeStyle = '#2b8da2';
  ctx.lineWidth = 3;
  const drawCorner = (ox, oy, s) => {
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.bezierCurveTo(ox + 30*s, oy + 10*s, ox + 50*s, oy + 50*s, ox + 10*s, oy + 70*s);
    ctx.bezierCurveTo(ox + 50*s, oy + 50*s, ox + 60*s, oy + 90*s, ox + 20*s, oy + 110*s);
    ctx.stroke();
  };
  drawCorner(50, 50, 1);
  ctx.save(); ctx.translate(w-50,50); ctx.scale(-1,1); drawCorner(0,0,1); ctx.restore();
  ctx.save(); ctx.translate(50,h-50); ctx.scale(1,-1); drawCorner(0,0,1); ctx.restore();
  ctx.save(); ctx.translate(w-50,h-50); ctx.scale(-1,-1); drawCorner(0,0,1); ctx.restore();
}

async function renderCover(flavor: string): Promise<Buffer> {
  const W = 768, H = 1152;
  const canvas = new Canvas(W, H);
  const ctx = canvas.getContext('2d');

  drawFrame(ctx, W, H);

  // центр: эмодзи как иллюстрация
  const emoji = pickEmoji(flavor);
  ctx.font = '120px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, W/2, H/2 - 60);

  // подпись вкуса
  ctx.fillStyle = '#6b6b6b';
  ctx.font = 'bold 56px Cinzel, Merriweather, serif';
  ctx.fillText(flavor.toUpperCase(), W/2, H - 160);

  return await canvas.toBuffer('image/png');
}

async function uploadToStorage(buffer: Buffer, filename: string): Promise<string> {
  const storageRef = ref(storage, `products/covers/${filename}`);
  await uploadBytes(storageRef, buffer, { contentType: 'image/png' });
  return await getDownloadURL(storageRef);
}

async function main() {
  console.log('🎨 Генеруємо обкладинки для сиропів...');
  const q = query(collection(db, 'products'), where('category', '==', 'syropy'));
  const snap = await getDocs(q);
  console.log(`Знайдено товарів: ${snap.size}`);

  let done = 0;
  for (const d of snap.docs) {
    const data: any = d.data();
    const flavor: string = (data.name || '').replace(/\s*Сироп\s*"?|"/gi, '').trim();
    if (!flavor) continue;

    const buf = await renderCover(flavor);
    const safeSlug = (data.slug || flavor.toLowerCase().replace(/\s+/g,'-')).replace(/[^a-z0-9\-]/gi,'');
    const url = await uploadToStorage(buf, `${safeSlug}.png`);

    const images = [url, COMMON_LOGO];
    await updateDoc(doc(db, 'products', d.id), {
      images,
      hoverImage: COMMON_LOGO
    });

    done++;
    if (done % 10 === 0) console.log(`✅ Згенеровано ${done}/${snap.size}`);
  }

  console.log(`🎉 Готово! Згенеровано ${done} обкладинок.`);
}

main().catch(e => { console.error('❌ Помилка генерації:', e); process.exit(1); });
