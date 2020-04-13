const Album = require('../models/album');

const getAllAlbums = async (req, res) => {
  await Album.find()
    .then(albums => {
      res.json(albums);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

const getAlbum = (req, res) => {
  res.json(res.album);
};

const createAlbum = async (req, res) => {
  const album = new Album({
    name: req.body.name,
    artist: req.body.artist,
    notes: req.body.notes
  });

  await album
    .save()
    .then(album => {
      res.status(201).json(album);
    })
    .catch(err => {
      res.status(400).json({ message: err.message });
    });
};

const updateAlbum = async (req, res) => {
  const id = req.params.id;
  const updatedAlbum = {
    name: req.body.name,
    artist: req.body.artist
  };

  Album.findOneAndUpdate({ _id: id }, { $set: updatedAlbum }, err => {
    if (err) {
      res.status(500).json({
        error: err
      });
    }
    res.status(200).json({ message: 'Product updated' });
  });
};

const deleteAlbum = async (req, res) => {
  await res.album
    .remove()
    .then(() => {
      res.json({ message: 'Deleted Album' });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

module.exports = {
  getAllAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum
};
