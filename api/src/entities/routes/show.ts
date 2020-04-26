import express from 'express';
import checkToken from 'middleware/checkToken';
import findOne from 'middleware/findOne';
import * as ShowsController from 'controllers/show';

export const showRoutes = express.Router();

showRoutes.get('/', ShowsController.getAllShows);

showRoutes.get('/:id', findOne, ShowsController.getShow);

showRoutes.post('/', checkToken, ShowsController.createShow);

showRoutes.patch('/:id', checkToken, ShowsController.updateShow);

showRoutes.delete('/:id', findOne, ShowsController.deleteShow);
