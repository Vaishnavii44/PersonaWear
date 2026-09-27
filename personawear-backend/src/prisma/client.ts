import { PrismaClient } from '@prisma/client';

// This prevents multiple instances of Prisma from running in development
const prisma = new PrismaClient();

export default prisma;