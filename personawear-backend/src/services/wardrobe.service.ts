import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addWardrobeItem = async (userId: string, itemData: any) => {
  return await prisma.wardrobeItem.create({
    data: {
      userId: userId, // Ties the clothing item to the specific user!
      category: itemData.category,
      imageUrl: itemData.imageUrl,
      colorHex: itemData.colorHex,
      brand: itemData.brand,
    },
  });
};

export const getUserWardrobe = async (userId: string) => {
  return await prisma.wardrobeItem.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' } // Newest clothes first
  });
};  