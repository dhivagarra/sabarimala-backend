import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../services/userService';

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}