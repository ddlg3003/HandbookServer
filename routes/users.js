import express from 'express';

import { googleToken, login, register } from '../controllers/user.js';

const router = express.Router();

router.post('/googleLogin', googleToken);
router.post('/login', login);
router.post('/register', register);

export default router;