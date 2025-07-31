import mongoose from 'mongoose';
import env from 'config/env';
import logger from 'utils/logger';

export default function connectToDatabase() {
  mongoose.connect(env.DATABASE_URL).catch((err: Error) => logger.error('mongoose error', err));

  const db = mongoose.connection;

  db.on('error', (error) => logger.error('Database error', error));
  db.once('open', () => logger.success('Connected to database'));
}
