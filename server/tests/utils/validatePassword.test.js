import { describe, it, expect } from '@jest/globals';
import { validatePassword } from '../../src/utils/validatePassword.js';

describe('validatePassword', () => {
  it('rechaza password vacío', () => {
    expect(validatePassword('')).toMatch(/al menos 8 caracteres/);
    expect(validatePassword(undefined)).toMatch(/al menos 8 caracteres/);
  });

  it('rechaza password con menos de 8 caracteres', () => {
    expect(validatePassword('Aa1!aa')).toMatch(/al menos 8 caracteres/);
  });

  it('exige al menos una mayúscula', () => {
    expect(validatePassword('aaaaaaa1!')).toMatch(/mayúscula/);
  });

  it('exige al menos una minúscula', () => {
    expect(validatePassword('AAAAAAA1!')).toMatch(/minúscula/);
  });

  it('exige al menos un número', () => {
    expect(validatePassword('Aaaaaaaa!')).toMatch(/número/);
  });

  it('exige al menos un carácter especial', () => {
    expect(validatePassword('Aaaaaaaa1')).toMatch(/carácter especial/);
  });

  it('acepta una password válida', () => {
    expect(validatePassword('Abcdefg1!')).toBeNull();
    expect(validatePassword('Pa$$w0rd')).toBeNull();
    expect(validatePassword('Test12345!@')).toBeNull();
  });
});
