import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));
router.post('/refresh', refresh);
router.post('/logout',  logout);
export default router;
