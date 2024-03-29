import mongoose from 'mongoose';
import envConfig from 'config/env';

const DATABASE_URL = `mongodb+srv://tim-prod:${envConfig.DB_PASSWORD}@tv-minder-cluster-rrvuj.mongodb.net/main?retryWrites=true&w=majority`;

export default function connectToDatabase() {
  mongoose.connect(DATABASE_URL).catch((err: Error) => console.log('mongoose error', err));

  const db = mongoose.connection;

  db.on('error', (error) => console.log('database error', error));
  db.once('open', () => console.log('Connected to database'));
}
