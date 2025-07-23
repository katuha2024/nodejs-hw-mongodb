import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/sessionModel.js';

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

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, 'Access token not found in session');
    }

    req.user = {
      _id: decoded.id,
    };

    next();
  } catch (error) {
    next(error);
  }
};
