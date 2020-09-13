import dotenv from 'dotenv';

dotenv.config();

export default {
  DB_PASSWORD: process.env.DB_PASSWORD,
  JWT_KEY: process.env.JWT_KEY,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
};
