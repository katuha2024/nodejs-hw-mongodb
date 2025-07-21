import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid email or password');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session._id.toString(), 
  };
};

export const refreshSession = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw createError(401, 'Refresh token not provided');
  }

  let payload;
  try {
    payload = jwt.verify(oldRefreshToken, process.env.JWT_SECRET);
  } catch {
    throw createError(401, 'Invalid refresh token');
  }

  const existingSession = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!existingSession) {
    throw createError(403, 'Session not found or expired');
  }

  await Session.findByIdAndDelete(existingSession._id);

  const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: payload.id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, newRefreshToken: refreshToken };
};

export const logoutUser = async (sessionId) => {
  if (!sessionId) {
    throw createError(400, 'Session ID is required');
  }

  const session = await Session.findById(sessionId);

  if (!session) {
    throw createError(401, 'Session not found or already logged out');
  }

  await Session.findByIdAndDelete(sessionId);
};
