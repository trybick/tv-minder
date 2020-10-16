import express from 'express';
import * as UserController from 'controllers/user';

const userRoutes = express.Router();

userRoutes.post('/register', UserController.registerUser);

userRoutes.post('/login', UserController.loginUser);

userRoutes.post('/requestonetimecode', UserController.requestOneTimeCode)

userRoutes.post('/verifyonetimecode', UserController.verifyOneTimeCode)

userRoutes.post('/changepasswordforreset', UserController.changePasswordForReset)

userRoutes.post('/changepassword', UserController.changePasswordForSettings)

export default userRoutes;
