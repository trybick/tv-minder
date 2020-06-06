import express from 'express';
import verifyToken from 'middleware/verifyToken';
import * as FollowShowController from 'entities/controllers/follow';

const followRoutes = express.Router();

followRoutes.post('/follow', verifyToken, FollowShowController.createFollow);

followRoutes.get('/follow', verifyToken, FollowShowController.getFollows);

followRoutes.delete('/follow', verifyToken, FollowShowController.deleteFollow);

export default followRoutes;
