import 'module-alias/register';
import express from 'express';
import connectToDatabase from 'config/database';
import configureCors from 'config/configureCors';
import userRoutes from 'entities/routes/user';
import trackShowRoutes from 'entities/routes/track';
import contactRoutes from 'entities/routes/contact';
import { limiter } from 'utils/limiter';
import logger from 'utils/logger';

const port = process.env.PORT || 4500;
const app = express();

app.use(configureCors);
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectToDatabase();

app.get('/api/health', (_req, res) => {
  res.status(200).json({ data: { status: 'ok' } });
});

app.use('/api', userRoutes);
app.use('/api', trackShowRoutes);
app.use('/api', contactRoutes);

app.listen(port, () => logger.success(`Server started on port ${port}`));
