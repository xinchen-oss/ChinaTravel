import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { connectInMemoryDB, disconnectInMemoryDB, clearDB } from '../helpers/db.js';
import City from '../../src/models/City.js';
import User from '../../src/models/User.js';
import jwt from 'jsonwebtoken';

let app;

const tokenFor = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

beforeAll(async () => {
  await connectInMemoryDB();
  ({ default: app } = await import('../../src/app.js'));
});
afterAll(async () => { await disconnectInMemoryDB(); });
afterEach(async () => { await clearDB(); });

describe('GET /api/ciudades', () => {
  it('devuelve un array vacío inicialmente', async () => {
    const res = await request(app).get('/api/ciudades');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('devuelve las ciudades existentes ordenadas por nombre', async () => {
    await City.create([
      { nombre: 'Pekín', slug: 'pekin', descripcion: 'Capital' },
      { nombre: 'Shanghái', slug: 'shanghai', descripcion: 'Económica' },
    ]);
    const res = await request(app).get('/api/ciudades');
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].nombre).toBe('Pekín');
  });

  it('GET /destacadas filtra por destacada=true', async () => {
    await City.create([
      { nombre: 'A', slug: 'a', descripcion: 'x', destacada: false },
      { nombre: 'B', slug: 'b', descripcion: 'y', destacada: true },
    ]);
    const res = await request(app).get('/api/ciudades/destacadas');
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe('b');
  });

  it('GET /:slug devuelve 404 si no existe', async () => {
    const res = await request(app).get('/api/ciudades/no-existe');
    expect(res.status).toBe(404);
  });

  it('GET /:slug devuelve la ciudad si existe', async () => {
    await City.create({ nombre: 'Xi An', slug: 'xian', descripcion: 'Antigua' });
    const res = await request(app).get('/api/ciudades/xian');
    expect(res.status).toBe(200);
    expect(res.body.data.nombre).toBe('Xi An');
  });
});

describe('POST /api/ciudades (admin)', () => {
  it('rechaza sin token (401)', async () => {
    const res = await request(app)
      .post('/api/ciudades')
      .send({ nombre: 'X', slug: 'x', descripcion: 'd' });
    expect(res.status).toBe(401);
  });

  it('rechaza con usuario sin rol ADMIN (403)', async () => {
    const user = await User.create({ nombre: 'U', email: 'u@t.com', password: 'Abcdefg1!' });
    const res = await request(app)
      .post('/api/ciudades')
      .set('Authorization', `Bearer ${tokenFor(user)}`)
      .send({ nombre: 'X', slug: 'x', descripcion: 'd' });
    expect(res.status).toBe(403);
  });

  it('crea la ciudad con usuario ADMIN', async () => {
    const admin = await User.create({
      nombre: 'A', email: 'a@t.com', password: 'Abcdefg1!', role: 'ADMIN',
    });
    const res = await request(app)
      .post('/api/ciudades')
      .set('Authorization', `Bearer ${tokenFor(admin)}`)
      .send({ nombre: 'Cantón', slug: 'canton', descripcion: 'Sur' });
    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('canton');
  });
});
