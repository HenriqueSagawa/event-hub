import { authService } from '../../src/services/auth.service';
import { prismaMock } from '../__mocks__/prisma';
import { mailService } from '../../src/services/mail.service';
import { BadRequestBodyError } from '../../src/errors/api-error';

describe('AuthService', () => {
  const userData = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
  };

  describe('register', () => {
    it('should register a new user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-id',
        email: userData.email,
        name: userData.name,
        password: 'hashed-password',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prismaMock.verificationCode.create.mockResolvedValue({
        id: 'code-id',
        code: '123456',
        userId: 'user-id',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const result = await authService.register(userData);

      expect(result).toEqual({ message: 'Usuário registrado. Verifique seu email para obter o código.' });
      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(prismaMock.verificationCode.create).toHaveBeenCalled();
      expect(mailService.sendVerificationCode).toHaveBeenCalledWith(userData.email, expect.any(String));
    });

    it('should throw if email is already registered', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'existing' } as any);

      try {
        await authService.register(userData);
        throw new Error('Should have thrown');
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Email já cadastrado');
      }
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 10);

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: userData.email,
        isVerified: false,
        verificationCodes: [
          { code: '123456', expiresAt: expirationDate },
        ],
      } as any);

      prismaMock.$transaction.mockResolvedValue([{}, {}]);

      const result = await authService.verifyEmail({ email: userData.email, code: '123456' });

      expect(result).toEqual({ message: 'Email verificado com sucesso' });
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { isVerified: true },
      });
    });

    it('should throw if code is invalid', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: userData.email,
        isVerified: false,
        verificationCodes: [
          { code: '654321', expiresAt: new Date(Date.now() + 10000) },
        ],
      } as any);

      try {
        await authService.verifyEmail({ email: userData.email, code: '123456' });
        throw new Error('Should have thrown');
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Código inválido ou expirado');
      }
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: userData.email,
        password: hashedPassword,
        isVerified: true,
      } as any);

      const result = await authService.login(userData);

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
    });

    it('should throw if user is not verified', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: userData.email,
        isVerified: false,
      } as any);

      try {
        await authService.login(userData);
        throw new Error('Should have thrown');
      } catch (error: any) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Email não verificado');
      }
    });
  });

  describe('completeProfile', () => {
    const profileData = {
      course: 'Computer Science',
      semester: 5,
      academicRecord: '123456789',
      phone: '11999999999',
      githubUrl: 'https://github.com/test',
      linkedinUrl: 'https://linkedin.com/in/test',
      bio: 'A test bio',
      interests: ['coding', 'music'],
      avatarUrl: 'https://example.com/avatar.jpg'
    };

    it('should complete profile successfully for a verified user', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-id', isVerified: true } as any);
      prismaMock.user.update.mockResolvedValue({ id: 'user-id', ...profileData } as any);

      const result = await authService.completeProfile('user-id', profileData);

      expect(result).toEqual({ message: 'Perfil atualizado com sucesso', user: { id: 'user-id', ...profileData } });
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: profileData,
      });
    });

    it('should throw if user is not verified', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-id', isVerified: false } as any);

      try {
        await authService.completeProfile('user-id', profileData);
        throw new Error('Should have thrown');
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Usuário não verificado. Verifique seu email primeiro.');
      }
    });

    it('should throw if academicRecord is not unique', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-id', isVerified: true } as any);
      
      const prismaError = new Error('Unique constraint failed on the fields: (`academicRecord`)');
      Object.defineProperty(prismaError, 'code', {
        value: 'P2002',
        writable: true,
        configurable: true,
        enumerable: true, // Make it enumerable
      });
      prismaMock.user.update.mockRejectedValueOnce(prismaError);

      try {
        await authService.completeProfile('user-id', profileData);
        throw new Error('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(BadRequestBodyError);
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain('Academic record already in use');
      }
    });
  });
});
