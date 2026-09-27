import { RequestHandler } from 'express';
import * as AuthService from '../services/auth.service';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, fullName, username } = req.body;
    if (!username) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }
    await AuthService.registerUser(email, password, fullName, username);
    res.status(201).json({ message: 'User created' });
  } catch (error: any) {
    console.error('Registration error details:', error.message);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Username or email already exists. Please choose another.' });
      return;
    }
    res.status(400).json({ error: 'Registration failed. Please try again later.' });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = identifier || email;
    const data = await AuthService.loginUser(loginIdentifier, password);
    res.json(data);
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(401).json({ error: error.message || 'Auth failed' });
  }
};

export const getProfile: RequestHandler = async (req, res, next) => {
  res.json({ user: (req as any).user });
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user.userId || (req as any).user.id;
    const { fullName, height, gender, aesthetic, notifications } = req.body;
    const updatedUser = await AuthService.updateProfile(userId, { fullName, height, gender, aesthetic, notifications });
    res.json({ user: updatedUser });
  } catch (error: any) {
    console.error('Update profile error:', error.message);
    res.status(400).json({ error: error.message || 'Update failed' });
  }
};