import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import connectToDatabase from 'config/database';
import { showRoutes } from 'entities/routes/show';
import { userRoutes } from 'entities/routes/user';
import { followShowRoutes } from 'entities/routes/followShow';

const app = express();
const port = process.env.NODE_ENV === 'production' ? 80 : 5000;

connectToDatabase();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(followShowRoutes);
app.use('/shows', showRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
