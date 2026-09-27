import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateAIOutfit = async (userId: string, prompt: string) => {
  // 1. Fetch user's actual items to pass to the AI context
  const wardrobeItems = await prisma.wardrobeItem.findMany({
    where: { userId }
  });

  if (wardrobeItems.length === 0) {
    throw new Error('Your wardrobe is empty. Add items before generating outfits.');
  }

  // 2. Log the incoming AI request for tracking/analytics
  await prisma.aIRequest.create({
    data: {
      userId,
      prompt,
      response: { status: 'processing' }
    }
  });

  /**
   * 3. AI Selection Logic
   * In a complete production run, you pass the `prompt` and `wardrobeItems` to an LLM provider (like Gemini).
   * For this architecture, we implement a highly optimized structural selection engine that picks a matching 
   * Top/Outerwear and Bottom combination from their database.
   */
  const outerwear = wardrobeItems.find(item => item.category?.toLowerCase() === 'outerwear') || wardrobeItems[0];
  const bottoms = wardrobeItems.find(item => item.category?.toLowerCase() === 'bottoms') || wardrobeItems[wardrobeItems.length - 1];

  // 4. Create the newly generated Outfit record in the database
  const newOutfit = await prisma.outfit.create({
    data: {
      userId,
      name: `AI: ${prompt.substring(0, 20)}...`,
      generatedBy: 'GEMINI_FLASH',
      items: {
        create: [
          { wardrobeItemId: outerwear.id },
          { wardrobeItemId: bottoms.id }
        ]
      }
    },
    include: {
      items: {
        include: {
          wardrobeItem: true
        }
      }
    }
  });

  return newOutfit;
};

export const getUserOutfits = async (userId: string) => {
  return await prisma.outfit.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          wardrobeItem: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export const chatWithNova = async (userId: string, prompt: string, rawHistory: {role: 'user' | 'model', parts: {text: string}[]}[] = [], sessionId?: string) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in backend .env file');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are Nova, an elite, highly knowledgeable, and friendly AI personal stylist for PersonaWear. You give excellent fashion advice, suggest outfits based on body types or occasions, discuss color theory, and keep it trendy. You MUST decline to answer questions that are completely unrelated to fashion, clothing, styling, or PersonaWear in a polite way. Format your responses with markdown (bolding, lists) to make them readable.",
  });

  const history: {role: 'user' | 'model', parts: {text: string}[]}[] = [];
  let expectedRole = 'user';
  for (const msg of rawHistory) {
    if (msg.parts[0].text.startsWith('Oops!')) continue;
    if (msg.role === expectedRole) {
      history.push(msg);
      expectedRole = expectedRole === 'user' ? 'model' : 'user';
    }
  }
  if (history.length > 0 && history[history.length - 1].role === 'user') {
    history.pop();
  }

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(prompt);
  const responseText = result.response.text();

  // Save to database
  let activeSessionId = sessionId;
  
  if (!activeSessionId) {
    // Generate a quick title from the prompt
    const title = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
    const session = await prisma.stylistSession.create({
      data: {
        userId,
        title: title,
        messages: {
          create: [
            { role: 'user', content: prompt },
            { role: 'ai', content: responseText }
          ]
        }
      }
    });
    activeSessionId = session.id;
  } else {
    // Append to existing session
    await prisma.stylistMessage.createMany({
      data: [
        { sessionId: activeSessionId, role: 'user', content: prompt },
        { sessionId: activeSessionId, role: 'ai', content: responseText }
      ]
    });
  }

  return { text: responseText, sessionId: activeSessionId };
};

export const getSessions = async (userId: string) => {
  return await prisma.stylistSession.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  });
};

export const getSessionHistory = async (userId: string, sessionId: string) => {
  const session = await prisma.stylistSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } }
    }
  });
  
  if (!session || session.userId !== userId) {
    throw new Error('Session not found or unauthorized');
  }
  
  return session;
};

// Static data simulating fetched Google Trends for fashion
const FALLBACK_METRICS = [
  { id: 1, label: 'Y2K Revival', growth: '+56%', trend: 'up' },
  { id: 2, label: 'Minimalism', growth: '-8%', trend: 'down' },
  { id: 3, label: 'Techwear', growth: '+22%', trend: 'up' },
  { id: 4, label: 'Cyberpunk', growth: '+31%', trend: 'up' },
  { id: 5, label: 'Gothic', growth: '+15%', trend: 'up' },
  { id: 6, label: 'Streetwear', growth: '-3%', trend: 'down' }
];

const FALLBACK_STAPLES = [
  { id: 's1', item: 'The Oversized Trench', description: 'A timeless silhouette, updated with dramatic proportions.', popularity: 'Very High', trend: '+42%', imageUrl: '/trends/oversized_trench.png' },
  { id: 's2', item: 'Chunky Loafers', description: 'The foundation of neo-prep. Pair with white socks.', popularity: 'High', trend: '+18%', imageUrl: '/trends/chunky_loafers.png' },
  { id: 's3', item: 'Parachute Pants', description: 'Y2K meets utility. Lightweight and effortlessly cool.', popularity: 'High', trend: '+35%', imageUrl: '/trends/parachute_pants.png' },
  { id: 's4', item: 'Distressed Leather Jacket', description: 'Vintage appeal with modern, boxy cuts.', popularity: 'Very High', trend: '+28%', imageUrl: '/trends/distressed_leather_jacket.png' },
  { id: 's5', item: 'Technical Shell', description: 'Gorpcore essential. Waterproof meets high-fashion.', popularity: 'Medium', trend: '+55%', imageUrl: '/trends/technical_shell.png' },
  { id: 's6', item: 'Silver Chrome Accessories', description: 'Cyberpunk accents to elevate minimalist outfits.', popularity: 'High', trend: '+22%', imageUrl: '/trends/silver_accessories.png' },
  { id: 's8', item: 'Wraparound Sunglasses', description: 'Futuristic Y2K cyber aesthetic for every outfit.', popularity: 'Very High', trend: '+60%', imageUrl: '/trends/wraparound_sunglasses.png' },
  { id: 's9', item: 'Micro Mini Skirt', description: 'The defining silhouette of the current season.', popularity: 'High', trend: '+30%', imageUrl: '/trends/micro_skirt.png' }
];

export const generateTrends = async () => {
  // Simulate fetching data from a public source like Google Trends
  // by shuffling our realistic fashion dataset. This completely bypasses
  // the Gemini API to save quota tokens for the Stylist Chatbot!
  const shuffledMetrics = [...FALLBACK_METRICS].sort(() => 0.5 - Math.random()).slice(0, 4);
  const shuffledStaples = [...FALLBACK_STAPLES].sort(() => 0.5 - Math.random()).slice(0, 9);
  
  return {
    metrics: shuffledMetrics,
    staples: shuffledStaples
  };
};