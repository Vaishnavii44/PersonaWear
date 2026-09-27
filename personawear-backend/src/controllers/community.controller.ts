import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: any;
}

export const uploadPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id || req.user.userId;
    const { image, content } = req.body;

    if (!image) {
      res.status(400).json({ error: 'Image is required' });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: `personawear/${userId}/community`,
    });

    const post = await prisma.communityPost.create({
      data: {
        userId,
        imageUrl: uploadResponse.secure_url,
        content: content || null,
      },
      include: {
        user: { select: { fullName: true, id: true } },
        _count: { select: { likes: true, saves: true } }
      }
    });

    res.status(201).json({ status: 'success', data: post });
  } catch (error) {
    console.error('Upload Post Error:', error);
    res.status(500).json({ error: 'Failed to upload post.' });
  }
};

export const getFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id || req.user?.userId;

    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, id: true } },
        _count: { select: { likes: true, saves: true } },
        ...(currentUserId && {
          likes: { where: { userId: currentUserId }, select: { id: true } },
          saves: { where: { userId: currentUserId }, select: { id: true } }
        })
      }
    });

    const formattedPosts = posts.map(post => {
      const isLiked = currentUserId ? (post as any).likes?.length > 0 : false;
      const isSaved = currentUserId ? (post as any).saves?.length > 0 : false;
      
      const { likes, saves, ...cleanPost } = post as any;
      return { ...cleanPost, isLiked, isSaved };
    });

    res.status(200).json({ status: 'success', data: formattedPosts });
  } catch (error) {
    console.error('Get Feed Error:', error);
    res.status(500).json({ error: 'Failed to fetch community feed.' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id || req.user.userId;
    const postId = req.params.id as string;

    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      res.status(200).json({ status: 'success', message: 'Post unliked', isLiked: false });
    } else {
      await prisma.like.create({ data: { userId, postId } });
      res.status(200).json({ status: 'success', message: 'Post liked', isLiked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like.' });
  }
};

export const toggleSave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id || req.user.userId;
    const postId = req.params.id as string;

    const existingSave = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existingSave) {
      await prisma.savedPost.delete({ where: { id: existingSave.id } });
      res.status(200).json({ status: 'success', message: 'Post unsaved', isSaved: false });
    } else {
      await prisma.savedPost.create({ data: { userId, postId } });
      res.status(200).json({ status: 'success', message: 'Post saved', isSaved: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle save.' });
  }
};