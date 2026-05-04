import { describe, it, expect } from '@jest/globals';
import { formatPrice } from '../../src/utils/helpers.js';

describe('helpers.formatPrice', () => {
  it('formatea un número con dos decimales y símbolo €', () => {
    expect(formatPrice(10)).toBe('10.00€');
    expect(formatPrice(10.5)).toBe('10.50€');
    expect(formatPrice(10.567)).toBe('10.57€');
  });

  it('acepta strings numéricos', () => {
    expect(formatPrice('25')).toBe('25.00€');
  });

  it('acepta cero', () => {
    expect(formatPrice(0)).toBe('0.00€');
  });
});
