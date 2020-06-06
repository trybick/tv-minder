import 'module-alias/register';
import express from 'express';
import connectToDatabase from 'config/database';
import { configureCors } from './config/cors';
import { userRoutes } from 'entities/routes/user';
import { followShowRoutes } from 'entities/routes/followShow';
import { healthCheckRoutes } from 'entities/routes/healthCheck';

const port = process.env.NODE_ENV === 'production' ? 80 : 5000;

const app = express();
app.use(configureCors);
app.use(express.json());

connectToDatabase();

app.use(healthCheckRoutes);
app.use(userRoutes);
app.use(followShowRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
