import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserDashboard = async (userId: string) => {
  // 1. Fetch the user's entire wardrobe
  const wardrobe = await prisma.wardrobeItem.findMany({
    where: { userId }
  });

  // 2. Fetch the user's generated outfits
  const outfits = await prisma.outfit.count({
    where: { userId }
  });

  // 3. Calculate some basic style metrics (e.g., category breakdown)
  const categoryCount: Record<string, number> = {};
  wardrobe.forEach(item => {
    const categoryName = item.category || 'Uncategorized';
   categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
  });

  // 4. Return a compiled stats object
  return {
    totalWardrobeItems: wardrobe.length,
    totalOutfitsGenerated: outfits,
    categoryBreakdown: categoryCount,
  };
};

export const logCustomMetric = async (userId: string, metric: string, value: any) => {
  return await prisma.fashionAnalytic.create({
    data: {
      userId,
      metric,
      value
    }
  });
};