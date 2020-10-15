import express from 'express';
import * as UserController from 'controllers/user';

const userRoutes = express.Router();

userRoutes.post('/register', UserController.registerUser);

userRoutes.post('/login', UserController.loginUser);

userRoutes.post('/processonetimecode', UserController.processOneTimeCode)

userRoutes.post('/onetimecodeverification', UserController.processOneTimeCodeVerification)

userRoutes.post('/changepassword', UserController.processChangePassword)

export default userRoutes;
