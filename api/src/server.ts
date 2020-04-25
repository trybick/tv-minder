import 'module-alias/register';
import express from 'express';
import connectToDatabase from 'config/database';
import { configureCors } from './config/cors';
import { albumRoutes } from 'entities/routes/album';
import { userRoutes } from 'entities/routes/user';

const app = express();
const port = 5000;

connectToDatabase();

app.use(express.json());
app.use(configureCors);

app.use('/albums', albumRoutes);
app.use(userRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
