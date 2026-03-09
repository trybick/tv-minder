import express from 'express';
import verifyToken from 'middleware/verifyToken';
import * as TrackShowController from 'entities/controllers/track';

const trackRoutes = express.Router();

trackRoutes.post('/track/:showId', verifyToken, TrackShowController.createTrack);
trackRoutes.get('/track', verifyToken, TrackShowController.getTracks);
trackRoutes.delete('/track/:showId', verifyToken, TrackShowController.deleteTrack);

export default trackRoutes;
