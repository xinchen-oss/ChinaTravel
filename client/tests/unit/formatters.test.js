import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, formatStars } from '../../src/utils/formatters';

describe('formatPrice', () => {
  it('formatea como moneda EUR en es-ES', () => {
    const result = formatPrice(10);
    // Tolera diferentes representaciones del símbolo de euro / espacios entre versiones de Node
    expect(result).toMatch(/10[,.]00/);
    expect(result).toMatch(/€/);
  });

  it('redondea a dos decimales', () => {
    const result = formatPrice(10.567);
    expect(result).toMatch(/10[,.]57/);
  });
});

describe('formatDate', () => {
  it('formatea una fecha ISO en formato largo es-ES', () => {
    const out = formatDate('2026-01-15');
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/enero/i);
  });
});

describe('formatStars', () => {
  it('devuelve 5 caracteres totales', () => {
    expect(formatStars(0)).toHaveLength(5);
    expect(formatStars(3)).toHaveLength(5);
    expect(formatStars(5)).toHaveLength(5);
  });

  it('rellena con estrellas llenas y vacías correctamente', () => {
    expect(formatStars(3)).toBe('★★★☆☆');
    expect(formatStars(0)).toBe('☆☆☆☆☆');
    expect(formatStars(5)).toBe('★★★★★');
  });
});
