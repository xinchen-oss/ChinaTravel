import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { connectInMemoryDB, disconnectInMemoryDB, clearDB } from '../helpers/db.js';

let app;

beforeAll(async () => {
  await connectInMemoryDB();
  ({ default: app } = await import('../../src/app.js'));
});
afterAll(async () => { await disconnectInMemoryDB(); });
afterEach(async () => { await clearDB(); });

let logSpy;
beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

const validUser = {
  nombre: 'Ana',
  apellidos: 'García',
  email: 'ana@test.com',
  password: 'Abcdefg1!',
};

describe('POST /api/auth/registro', () => {
  it('registra a un usuario válido y devuelve token', async () => {
    const res = await request(app).post('/api/auth/registro').send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('ana@test.com');
    expect(res.body.user.role).toBe('USER');
    expect(res.body.user.password).toBeUndefined();
  });

  it('rechaza email no válido (400)', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ ...validUser, email: 'no-es-email' });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('rechaza password débil (400)', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ ...validUser, password: '123' });
    expect(res.status).toBe(400);
  });

  it('rechaza email duplicado (400)', async () => {
    await request(app).post('/api/auth/registro').send(validUser);
    const res = await request(app).post('/api/auth/registro').send(validUser);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/ya está registrado|email/i);
  });

  it('un comercial queda pendingApproval y sin token', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({
        ...validUser,
        email: 'com@test.com',
        role: 'COMERCIAL',
        empresaNombre: 'ACME',
        empresaCIF: 'B12345678',
      });
    expect(res.status).toBe(201);
    expect(res.body.pendingApproval).toBe(true);
    expect(res.body.token).toBeUndefined();
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/registro').send(validUser);
  });

  it('inicia sesión con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(validUser.email);
  });

  it('rechaza con password incorrecta (401)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'OtraPass1!' });
    expect(res.status).toBe(401);
  });

  it('rechaza con email no registrado (401)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: validUser.password });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('devuelve el usuario actual con token válido', async () => {
    const reg = await request(app).post('/api/auth/registro').send(validUser);
    const token = reg.body.token;
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(validUser.email);
  });

  it('devuelve 401 con token inválido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token.invalido.aqui');
    expect(res.status).toBe(401);
  });
});
