import { Router } from 'express';
import userController from '../controllers/user.controller';
import { validate } from '../middleware/validator';
import { createUserSchema, updateUserSchema, loginSchema } from '../validators';

const router = Router();

// User CRUD
router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/search/email', userController.getUserByEmail);
router.get('/search/username', userController.getUserByUsername);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Authentication
router.post('/login', validate(loginSchema), userController.login);

export default router;
