import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { connectInMemoryDB, disconnectInMemoryDB, clearDB } from '../helpers/db.js';
import User from '../../src/models/User.js';

beforeAll(async () => { await connectInMemoryDB(); });
afterAll(async () => { await disconnectInMemoryDB(); });
afterEach(async () => { await clearDB(); });

describe('Modelo User', () => {
  it('hashea la contraseña antes de guardar', async () => {
    const plain = 'Abcdefg1!';
    const user = await User.create({ nombre: 'Ana', email: 'ana@test.com', password: plain });
    const reloaded = await User.findById(user._id).select('+password');
    expect(reloaded.password).not.toBe(plain);
    expect(reloaded.password.length).toBeGreaterThan(20);
  });

  it('comparePassword devuelve true para la contraseña correcta', async () => {
    const user = await User.create({ nombre: 'Bob', email: 'bob@test.com', password: 'Abcdefg1!' });
    const reloaded = await User.findById(user._id).select('+password');
    expect(await reloaded.comparePassword('Abcdefg1!')).toBe(true);
    expect(await reloaded.comparePassword('otra')).toBe(false);
  });

  it('rechaza emails duplicados', async () => {
    await User.create({ nombre: 'A', email: 'dup@test.com', password: 'Abcdefg1!' });
    await expect(
      User.create({ nombre: 'B', email: 'dup@test.com', password: 'Abcdefg1!' })
    ).rejects.toThrow();
  });

  it('asigna USER como rol por defecto', async () => {
    const user = await User.create({ nombre: 'C', email: 'c@test.com', password: 'Abcdefg1!' });
    expect(user.role).toBe('USER');
    expect(user.isActive).toBe(true);
    expect(user.isApproved).toBe(true);
  });

  it('rechaza emails sin nombre', async () => {
    await expect(
      User.create({ email: 'd@test.com', password: 'Abcdefg1!' })
    ).rejects.toThrow(/nombre/);
  });
});
