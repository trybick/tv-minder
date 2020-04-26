import express from 'express';
import checkToken from 'middleware/checkToken';
import * as FollowShowController from 'controllers/followShow';

export const followShowRoutes = express.Router();

followShowRoutes.post('/follow', checkToken, FollowShowController.createFollow);

// followShowRoutes.get('/follow', checkToken, FollowShowController.getFollows);
