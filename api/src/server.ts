import 'module-alias/register';
import express from 'express';
import connectToDatabase from 'config/database';
import configureCors from 'config/configureCors';
import userRoutes from 'entities/routes/user';
import followShowRoutes from 'entities/routes/follow';
import healthCheckRoutes from 'entities/routes/healthCheck';
import contactRoutes from 'entities/routes/contact';

const port = process.env.PORT || 5000;
const app = express();

app.use(configureCors);
app.use(express.json());

connectToDatabase();

app.use(healthCheckRoutes);
app.use(userRoutes);
app.use(followShowRoutes);
app.use(contactRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
