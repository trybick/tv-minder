import express from 'express';
import * as UserController from 'controllers/user';

const userRoutes = express.Router();

userRoutes.post('/register', UserController.registerUser);
userRoutes.post('/login', UserController.loginUser);

userRoutes.post('/request-one-time-code', UserController.requestOneTimeCode);
userRoutes.post('/verify-one-time-code', UserController.verifyOneTimeCode);
userRoutes.post('/change-password-for-reset', UserController.changePasswordForReset);

userRoutes.post('/change-password', UserController.changePasswordForSettings);

export default userRoutes;
