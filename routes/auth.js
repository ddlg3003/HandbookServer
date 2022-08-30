import express from 'express';
import { googleToken } from '../controllers/auth.js';

const router = express.Router();

router.post('/google', googleToken);

export default router;  


