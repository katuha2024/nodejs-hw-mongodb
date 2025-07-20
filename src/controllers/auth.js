import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { refreshSession } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';

export const logout = async (req, res) => {
  const sessionId = req.user.sessionId;

  await logoutUser(sessionId); 

  res.clearCookie('refreshToken'); 
  res.status(204).end(); 
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    const { accessToken, newRefreshToken } = await refreshSession(refreshToken);

    res
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
          accessToken,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res) => {
  const newUser = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

export const login = async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
};