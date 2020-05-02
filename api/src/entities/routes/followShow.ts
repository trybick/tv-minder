import express from 'express';
import verifyToken from 'middleware/verifyToken';
import * as FollowShowController from 'controllers/followShow';

export const followShowRoutes = express.Router();

followShowRoutes.post('/follow', verifyToken, FollowShowController.createFollow);

followShowRoutes.get('/follow', verifyToken, FollowShowController.getFollows);

followShowRoutes.delete('/follow', verifyToken, FollowShowController.deleteFollow);
