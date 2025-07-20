import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Access token is missing or invalid');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const user = await User.findById(decoded.id);
    if (!user || user.sessionId !== decoded.sessionId) {
      throw createHttpError(401, 'Invalid session');
    }

    req.user = {
      id: user._id,
      sessionId: user.sessionId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
