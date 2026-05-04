import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from '../../src/utils/validators';

describe('validateEmail', () => {
  it('acepta emails válidos', () => {
    expect(validateEmail('a@b.com')).toBe(true);
    expect(validateEmail('user.name+tag@dominio.es')).toBe(true);
  });

  it('rechaza emails inválidos', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('sin-arroba')).toBe(false);
    expect(validateEmail('a@b')).toBe(false);
    expect(validateEmail('@b.com')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('acepta una password fuerte', () => {
    expect(validatePassword('Abcdefg1!')).toBe(true);
  });

  it('rechaza si falta algún requisito', () => {
    expect(validatePassword('short1!')).toBe(false);
    expect(validatePassword('alllowercase1!')).toBe(false);
    expect(validatePassword('ALLUPPERCASE1!')).toBe(false);
    expect(validatePassword('NoNumbers!')).toBe(false);
    expect(validatePassword('NoSpecial1A')).toBe(false);
  });

  it('rechaza vacíos / undefined', () => {
    expect(validatePassword('')).toBe(false);
    expect(validatePassword(undefined)).toBe(false);
  });
});

describe('validateRequired', () => {
  it('rechaza valores vacíos o solo espacios', () => {
    expect(validateRequired('')).toBeFalsy();
    expect(validateRequired('   ')).toBeFalsy();
    expect(validateRequired(null)).toBeFalsy();
    expect(validateRequired(undefined)).toBeFalsy();
  });

  it('acepta strings con contenido', () => {
    expect(validateRequired('hola')).toBeTruthy();
    expect(validateRequired(' x ')).toBeTruthy();
    expect(validateRequired('123')).toBeTruthy();
  });
});
