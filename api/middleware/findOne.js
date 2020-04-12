const Album = require('../models/album.model');

async function findOne(req, res, next) {
  let album;
  try {
    album = await Album.findById(req.params.id);
    if (album === null) {
      return res.status(404).json({ message: 'Cannot find album' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.album = album;
  next();
}

module.exports = findOne;
