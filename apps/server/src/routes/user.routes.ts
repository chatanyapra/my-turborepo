import { Router } from 'express';
import userController from '../controllers/user.controller';
import { validate } from '../middleware/validator';
import { createUserSchema, updateUserSchema, loginSchema } from '../validators';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// User CRUD
router.post('/', validate(createUserSchema), authenticate, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/search/email', userController.getUserByEmail);
router.get('/search/username', userController.getUserByUsername);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateUserSchema), authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

// Authentication
router.post('/signup', validate(createUserSchema), userController.signup);
router.post('/login', validate(loginSchema), userController.login);

export default router;
