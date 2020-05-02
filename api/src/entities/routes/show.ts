import express from 'express';
import verifyToken from 'middleware/verifyToken';
import findOne from 'middleware/findOne';
import * as ShowsController from 'controllers/show';

export const showRoutes = express.Router();

showRoutes.get('/', ShowsController.getAllShows);

showRoutes.get('/:id', findOne, ShowsController.getShow);

showRoutes.post('/', verifyToken, ShowsController.createShow);

showRoutes.patch('/:id', verifyToken, ShowsController.updateShow);

showRoutes.delete('/:id', findOne, ShowsController.deleteShow);
