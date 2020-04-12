const mongoose = require('mongoose');

let AlbumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    artist: { type: String, required: true },
    notes: { type: String, required: false, default: null }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Album', AlbumSchema);
