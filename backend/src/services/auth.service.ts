import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { mailService } from './mail.service';
import { BadRequestBodyError, UnauthorizedError } from '../errors/api-error';
import { RegisterSchema, LoginSchema, VerifySchema, CompleteProfileSchema } from '../schemas/auth.schema';

class AuthService {
  async register(data: unknown) {
    const { email, name, password } = RegisterSchema.parse(data);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestBodyError('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.verificationCode.create({
      data: {
        code: verificationCode,
        userId: user.id,
        expiresAt,
      },
    });

    await mailService.sendVerificationCode(email, verificationCode);

    return { message: 'Usuário registrado. Verifique seu email para obter o código.' };
  }

  async verifyEmail(data: unknown) {
    const { email, code } = VerifySchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { verificationCodes: true },
    });

    if (!user) {
      throw new BadRequestBodyError('Usuário não encontrado');
    }

    if (user.isVerified) {
      throw new BadRequestBodyError('Email já verificado');
    }

    const validCode = user.verificationCodes.find(
      (vc: { code: string; expiresAt: Date }) => vc.code === code && vc.expiresAt > new Date()
    );

    if (!validCode) {
      throw new BadRequestBodyError('Código inválido ou expirado');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      }),
      prisma.verificationCode.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return { message: 'Email verificado com sucesso' };
  }

  async login(data: unknown) {
    const { email, password } = LoginSchema.parse(data);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    if (!user.isVerified) {
      throw new UnauthorizedError('Email não verificado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
        avatarUrl: true,
        course: true,
        semester: true,
        academicRecord: true,
        phone: true,
        githubUrl: true,
        linkedinUrl: true,
        interests: true,
        bio: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado');
    }

    return user;
  }

  async completeProfile(userId: string, data: unknown) {
    const { avatarUrl, course, semester, academicRecord, phone, githubUrl, linkedinUrl, interests, bio } = CompleteProfileSchema.parse(data);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado');
    }
    if (!user.isVerified) {
      throw new BadRequestBodyError('Usuário não verificado. Verifique seu email primeiro.');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl,
        course,
        semester,
        academicRecord,
        phone,
        githubUrl,
        linkedinUrl,
        interests,
        bio,
      },
    });

    return { message: 'Perfil atualizado com sucesso', user: updatedUser };
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new BadRequestBodyError('Academic record already in use');
    }
    throw error;
  }
}

export const authService = new AuthService();
