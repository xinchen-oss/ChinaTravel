import { describe, it, expect, vi } from 'vitest';
import { getImageUrl, getCultureImageUrl, handleImageError } from '../../src/utils/imageHelper';

describe('getImageUrl', () => {
  it('devuelve la URL tal cual si empieza por http', () => {
    expect(getImageUrl('https://x.com/a.jpg')).toBe('https://x.com/a.jpg');
  });

  it('devuelve un fallback cuando no hay URL ni uniqueKey', () => {
    expect(getImageUrl('')).toMatch(/^https?:\/\//);
  });

  it('selecciona una imagen estable según uniqueKey', () => {
    const a = getImageUrl('', 'china');
    const b = getImageUrl('', 'china');
    expect(a).toBe(b);
    expect(a).toMatch(/^https?:\/\//);
  });

  it('keys distintos pueden devolver imágenes distintas', () => {
    const r1 = getImageUrl('', 'aaa');
    const r2 = getImageUrl('', 'zzz');
    expect(r1).toMatch(/^https?:\/\//);
    expect(r2).toMatch(/^https?:\/\//);
  });
});

describe('getCultureImageUrl', () => {
  it('usa la URL pasada cuando existe', () => {
    expect(getCultureImageUrl('https://foo/bar.jpg')).toBe('https://foo/bar.jpg');
  });

  it('rota por índice cuando no hay URL', () => {
    const a = getCultureImageUrl(undefined, 'FESTIVALES', 0);
    const b = getCultureImageUrl(undefined, 'FESTIVALES', 0);
    expect(a).toBe(b);
    expect(a).toMatch(/^https:\/\/images\.unsplash\.com/);
  });
});

describe('handleImageError', () => {
  it('reemplaza src del target con una imagen del pool determinada por alt', () => {
    const target = { alt: 'gran muralla', src: 'broken.png' };
    handleImageError({ target });
    expect(target.src).toMatch(/^https:\/\/images\.unsplash\.com/);
    // determinismo: mismo alt -> misma sustitución
    const second = { alt: 'gran muralla', src: 'broken.png' };
    handleImageError({ target: second });
    expect(second.src).toBe(target.src);
  });
});
