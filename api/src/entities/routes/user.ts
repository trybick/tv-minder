import express from 'express';
import * as UserController from 'controllers/user';

export const userRoutes = express.Router();

userRoutes.post('/register', UserController.registerUser);

userRoutes.post('/login', UserController.loginUser);
