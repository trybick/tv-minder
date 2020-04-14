import express from 'express';
import checkToken from 'middleware/checkToken';
import findOne from 'middleware/findOne';
import * as AlbumsController from 'controllers/album';

export const albumRoutes = express.Router();

albumRoutes.get('/', AlbumsController.getAllAlbums);

albumRoutes.get('/:id', findOne, AlbumsController.getAlbum);

albumRoutes.post('/', checkToken, AlbumsController.createAlbum);

albumRoutes.patch('/:id', checkToken, AlbumsController.updateAlbum);

albumRoutes.delete('/:id', findOne, AlbumsController.deleteAlbum);
