import request from 'supertest';
import app from '../../src/app';
import { prismaMock } from '../__mocks__/prisma';
import bcrypt from 'bcryptjs';

describe('Auth Routes Integration', () => {
  const userData = {
    email: 'integration@example.com',
    name: 'Integration User',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('should return 201 on successful registration', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({ id: '1', ...userData, isVerified: false } as any);
      prismaMock.verificationCode.create.mockResolvedValue({} as any);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Usuário registrado');
    });

    it('should return 400 if validation fails', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 and a token on successful login', async () => {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: userData.email,
        password: hashedPassword,
        isVerified: true,
      } as any);

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for unverified user', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: userData.email,
        isVerified: false,
      } as any);

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Email não verificado');
    });
  });
});
