import express from 'express';
import { register, login, refresh, logout, sendResetEmail, getCurrentUser } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { registerSchema, loginSchema, resetEmailSchema } from '../schemas/authSchemas.js';
import {resetPasswordSchema}   from '../schemas/authSchemas.js';
import { resetPasswordController } from '../controllers/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/send-reset-email', validateBody(resetEmailSchema), ctrlWrapper(sendResetEmail));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
router.get('/current', authenticate, ctrlWrapper(getCurrentUser));
export default router;
