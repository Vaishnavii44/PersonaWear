// src/services/auth.service.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/jwt';

const prisma = new PrismaClient();

export const registerUser = async (email: string, password: string, fullName: string, username: string) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { email, passwordHash, fullName, username }
  });
};

export const loginUser = async (identifier: string, password: string) => {
  const isEmail = identifier.includes('@');
  const user = await prisma.user.findFirst({
    where: isEmail ? { email: identifier } : { username: identifier }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Invalid credentials');
  }
  
  const tokens = generateTokens(user.id, user.email);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken }
  });
  
  return { user, ...tokens };
};

export const updateProfile = async (userId: string, data: { fullName?: string, height?: string, gender?: string, aesthetic?: string, notifications?: string }) => {
  return await prisma.user.update({
    where: { id: userId },
    data
  });
};