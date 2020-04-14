import mongoose from 'mongoose';

let AlbumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    artist: { type: String, required: true },
    notes: { type: String, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Album', AlbumSchema);
