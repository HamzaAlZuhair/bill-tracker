import express from 'express';
import { loginUser, registerUser, verifyUser, logoutUser, refreshAccessToken } from '../controllers/auth-controller';
import { getUserName } from '../controllers/user-controller';
import userVerification from '../middleware/auth-middleware';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', verifyUser);
router.post('/logout', logoutUser);
router.get('/getusername', userVerification, getUserName);
router.post('/refresh', refreshAccessToken);

export default router;
