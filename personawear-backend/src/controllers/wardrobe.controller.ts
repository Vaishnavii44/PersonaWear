import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
// import OpenAI from 'openai'; 

const prisma = new PrismaClient();

// Extending Express Request to include our custom user payload
interface AuthRequest extends Request {
  user?: any;
}

export const uploadClothing = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id || req.user.userId;
    const fileStr = req.body.image; 
    const collection = req.body.collection || null;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: `personawear/${userId}/closet`,
    });

    // AI Classification Mock
    const aiTags = {
      category: 'Jacket',
      color: 'Navy Blue',
      pattern: 'Solid',
      material: 'Denim',
      style: 'Casual',
      season: 'Fall',
      occasion: 'Everyday',
    };

    // Save to PostgreSQL via Prisma (using wardrobeItem to match schema)
    const newItem = await prisma.wardrobeItem.create({
      data: {
        userId,
        imageUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        collection,
        ...aiTags,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process and save clothing item.' });
  }
};

export const getWardrobe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id || req.user.userId;
    const items = await prisma.wardrobeItem.findMany({
      where: { userId },
      orderBy: [
        { isFavorite: 'desc' },
        { createdAt: 'desc' }
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wardrobe.' });
  }
};

export const deleteCollection = async (req: AuthRequest, res: Response) => {
  try {
    const name = req.params.name as string;
    const userId = req.user.id || req.user.userId;
    await prisma.wardrobeItem.updateMany({
      where: { userId, collection: name },
      data: { collection: null },
    });
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete collection.' });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user.id || req.user.userId;
    await prisma.wardrobeItem.delete({
      where: { id, userId },
    });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user.id || req.user.userId;
    
    // First, find the item to get its current state
    const item = await prisma.wardrobeItem.findUnique({ where: { id, userId } });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    // Toggle the isFavorite state
    const updatedItem = await prisma.wardrobeItem.update({
      where: { id },
      data: { isFavorite: !item.isFavorite }
    });
    
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite.' });
  }
};

export const saveOutfit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { name, items } = req.body; // items: [{ id: "...", slot: "top", basicItem: {...} }, ...]
    
    // Process items: If an item is a basic item (short ID), we must create it in the user's DB first.
    const processedItems = await Promise.all(items.map(async (item: any) => {
      if (item.id.length < 10 && item.basicItem) {
        // It's a basic item, save it to DB
        const newWardrobeItem = await prisma.wardrobeItem.create({
          data: {
            userId,
            imageUrl: item.basicItem.imageUrl,
            category: item.basicItem.category,
            color: item.basicItem.color,
            season: item.basicItem.season,
            style: item.basicItem.style,
            collection: 'Basic Wardrobe'
          }
        });
        return { slot: item.slot, wardrobeItemId: newWardrobeItem.id };
      }
      return { slot: item.slot, wardrobeItemId: item.id };
    }));
    
    // Create Outfit and link items
    const newOutfit = await prisma.outfit.create({
      data: {
        userId,
        name: name || "My Custom Outfit",
        generatedBy: "user",
        items: {
          create: processedItems.map(pi => ({
            wardrobeItem: { connect: { id: pi.wardrobeItemId } },
            slot: pi.slot
          }))
        }
      },
      include: {
        items: {
          include: { wardrobeItem: true }
        }
      }
    });
    
    res.status(201).json(newOutfit);
  } catch (error) {
    console.error('Save Outfit Error:', error);
    res.status(500).json({ error: 'Failed to save outfit.' });
  }
};

export const getOutfits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id || req.user.userId;
    const outfits = await prisma.outfit.findMany({
      where: { userId },
      include: {
        items: {
          include: { wardrobeItem: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(outfits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch outfits.' });
  }
};

export const deleteOutfit = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user.id || req.user.userId;
    await prisma.outfit.delete({
      where: { id, userId },
    });
    res.status(200).json({ message: 'Outfit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete outfit.' });
  }
};