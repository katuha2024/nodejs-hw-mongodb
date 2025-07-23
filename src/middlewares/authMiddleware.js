import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Not authorized (no token)' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.sessionId !== decoded.sessionId) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.user = {
      _id: user._id,
      sessionId: user.sessionId,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized', error: error.message });
  }
};
console.log('JWT_SECRET:', process.env.JWT_SECRET);