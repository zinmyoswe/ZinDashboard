import express from 'express';
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    register,
    login,
    getProfile
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);

// Admin only routes
router.get('/', authenticate, authorize([0, 1]), getUsers);
router.get('/:id', authenticate, authorize([0, 1]), getUser);
router.post('/', authenticate, authorize([0, 1]), createUser);
router.put('/:id', authenticate, authorize([0, 1]), updateUser);
router.delete('/:id', authenticate, authorize([0, 1]), deleteUser);

export default router;