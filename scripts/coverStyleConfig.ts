export interface CoverStyleConfig {
  canvasSize: number;
  parchmentColor: string;
  parchmentNoiseOpacity: number;
  framePrimaryColor: string;
  frameOuterWidth: number;
  frameInnerWidth: number;
  frameMargins: { outer: number; inner: number };
  swirlEnabled: boolean;
  emojiCircleRadius: number;
  emojiCircleFill: string;
  emojiCircleStroke: string;
  emojiFont: string; // CSS font string
  emojiYOffset: number;
  titleFont: string; // CSS font string
  titleColor: string;
  titleY: number; // Absolute Y position
  quality: number; // WebP quality (0-1)
}

// Default template (replace values after exporting style tokens from Canva)
export const defaultCoverStyle: CoverStyleConfig = {
  canvasSize: 1000,
  parchmentColor: '#efe7d6',
  parchmentNoiseOpacity: 0.08,
  framePrimaryColor: '#2b8da2',
  frameOuterWidth: 18,
  frameInnerWidth: 5,
  frameMargins: { outer: 26, inner: 52 },
  swirlEnabled: true,
  emojiCircleRadius: 160,
  emojiCircleFill: 'rgba(255,255,255,0.85)',
  emojiCircleStroke: 'rgba(43,141,162,0.85)',
  emojiFont: '132px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji"',
  emojiYOffset: 6,
  titleFont: 'bold 64px Cinzel, Merriweather, serif',
  titleColor: '#6b6b6b',
  titleY: 860,
  quality: 0.85,
};
