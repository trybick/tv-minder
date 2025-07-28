import 'module-alias/register';
import express from 'express';
import connectToDatabase from 'config/database';
import configureCors from 'config/configureCors';
import userRoutes from 'entities/routes/user';
import followShowRoutes from 'entities/routes/follow';
import contactRoutes from 'entities/routes/contact';
import { limiter } from 'utils/limiter';

const port = process.env.PORT || 5000;
const app = express();

app.use(configureCors);
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectToDatabase();

app.use(userRoutes);
app.use(followShowRoutes);
app.use(contactRoutes);

app.listen(port, () => console.log(`✅ Server started on port ${port}`));
