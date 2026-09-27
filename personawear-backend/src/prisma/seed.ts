import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@personawear.ai' },
    update: {},
    create: {
      email: 'test@personawear.ai',
      passwordHash: 'hashed_password_placeholder',
      fullName: 'Test User',
      tier: 'PREMIUM',
      wardrobe: {
        create: [
          {
            category: 'Outerwear',
            imageUrl: 'https://example.com/jacket.png',
            brand: 'Zara',
            colorHex: '#000000'
          },
          {
            category: 'Bottoms',
            imageUrl: 'https://example.com/jeans.png',
            brand: 'Levi',
            colorHex: '#0000FF'
          }
        ]
      }
    },
  });

  console.log(`✅ Seed successful. Created User: ${user.fullName} with 2 wardrobe items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });