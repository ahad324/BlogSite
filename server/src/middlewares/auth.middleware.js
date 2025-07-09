import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/helpers.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: `Invalid or expired token ${error}` });
  }
});
