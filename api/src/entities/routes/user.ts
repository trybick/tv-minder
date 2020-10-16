import express from 'express';
import * as UserController from 'controllers/user';

const userRoutes = express.Router();

userRoutes.post('/register', UserController.registerUser);

userRoutes.post('/login', UserController.loginUser);

userRoutes.post('/processonetimecode', UserController.processRequestOneTimeCode)

userRoutes.post('/onetimecodeverification', UserController.processVerifyOneTimeCode)

userRoutes.post('/changepassword', UserController.processChangePassword)

export default userRoutes;
