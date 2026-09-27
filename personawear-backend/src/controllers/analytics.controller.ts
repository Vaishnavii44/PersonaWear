import { RequestHandler } from 'express';
import * as AnalyticsService from '../services/analytics.service';

export const getDashboard: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user.userId || (req as any).user.id;
    
    const dashboardData = await AnalyticsService.getUserDashboard(userId);
    res.status(200).json({ status: 'success', data: dashboardData });
  } catch (error: any) {
    next(error);
  }
};