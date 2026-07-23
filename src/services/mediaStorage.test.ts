import { getMediaFileKind, validateMediaFile } from './mediaStorage';

describe('media file validation', () => {
  it('accepts supported image and video formats', () => {
    expect(getMediaFileKind({ name: 'photo.webp', type: 'image/webp' })).toBe('image');
    expect(getMediaFileKind({ name: 'clip.mp4', type: 'video/mp4' })).toBe('video');
    expect(getMediaFileKind({ name: 'photo.avif', type: '' })).toBe('image');
  });

  it('rejects unsupported formats and oversized files', () => {
    expect(() => validateMediaFile({
      name: 'clip.mov',
      type: 'video/quicktime',
      size: 1024
    })).toThrow('Підтримуються');

    expect(() => validateMediaFile({
      name: 'photo.jpg',
      type: 'image/jpeg',
      size: 6 * 1024 * 1024
    })).toThrow('5 МБ');
  });
});
