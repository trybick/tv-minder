import mongoose from 'mongoose';
import env from 'config/env';

export default function connectToDatabase() {
  mongoose.connect(env.DATABASE_URL).catch((err: Error) => console.log('mongoose error', err));

  const db = mongoose.connection;

  db.on('error', (error) => console.log('❌  Database error', error));
  db.once('open', () => console.log('✅ Connected to database'));
}
