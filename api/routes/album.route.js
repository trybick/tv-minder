const router = require('express').Router();
const checkToken = require('../middleware/checkToken');
const findOne = require('../middleware/findOne');
const AlbumsController = require('../controllers/album.controller');

router.get('/', AlbumsController.getAllAlbums);

router.get('/:id', findOne, AlbumsController.getAlbum);

router.post('/', checkToken, AlbumsController.createAlbum);

router.patch('/:id', checkToken, AlbumsController.updateAlbum);

router.delete('/:id', findOne, AlbumsController.deleteAlbum);

module.exports = router;
