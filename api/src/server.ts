import 'module-alias/register';
import express from 'express';
import connectToDatabase from 'config/database';
import { configureCors } from './config/cors';
import { showRoutes } from 'entities/routes/show';
import { userRoutes } from 'entities/routes/user';
import { followShowRoutes } from 'entities/routes/followShow';

const app = express();
const port = 5000;

connectToDatabase();

app.use(express.json());
app.use(configureCors);

app.use(userRoutes);
app.use(followShowRoutes);
app.use('/shows', showRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
