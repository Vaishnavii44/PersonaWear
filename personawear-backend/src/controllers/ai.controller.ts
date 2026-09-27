import { RequestHandler } from 'express';
import * as AIService from '../services/ai.service';

export const generateOutfit: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user.userId || (req as any).user.id;
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'A style prompt is required.' });
      return;
    }

    const outfit = await AIService.generateAIOutfit(userId, prompt);
    res.status(201).json({ status: 'success', data: outfit });
  } catch (error: any) {
    next(error);
  }
};

export const getSavedOutfits: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user.userId || (req as any).user.id;
    const outfits = await AIService.getUserOutfits(userId);
    res.status(200).json({ status: 'success', count: outfits.length, data: outfits });
  } catch (error: any) {
    next(error);
  }
};

export const chat: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id || 'anonymous';
    const { prompt, history, sessionId } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'A prompt is required.' });
      return;
    }

    const responseData = await AIService.chatWithNova(userId, prompt, history || [], sessionId);
    res.status(200).json({ status: 'success', data: responseData });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
};

export const getSessions: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id || 'anonymous';
    const sessions = await AIService.getSessions(userId);
    res.status(200).json({ status: 'success', data: sessions });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch sessions' });
  }
};

export const getSessionDetails: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?.id || 'anonymous';
    const id = req.params.id as string;
    const session = await AIService.getSessionHistory(userId, id);
    res.status(200).json({ status: 'success', data: session });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch session details' });
  }
};

export const getTrends: RequestHandler = async (req, res, next) => {
  try {
    const trends = await AIService.generateTrends();
    res.status(200).json({ status: 'success', data: trends });
  } catch (error: any) {
    console.error("Trends Error:", error);
    res.status(500).json({ error: error.message || 'Failed to fetch AI trends' });
  }
};