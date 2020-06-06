import express from 'express';
import * as UserController from 'controllers/user';

const userRoutes = express.Router();

userRoutes.post('/register', UserController.registerUser);

userRoutes.post('/login', UserController.loginUser);

export default userRoutes;
