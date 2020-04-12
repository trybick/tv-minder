const express = require('express');
const database = require('./config/database');
const albumRoutes = require('./routes/album.route');
const userRoutes = require('./routes/user.route');

const app = express();
const port = 5000;

database.connect();
app.use(express.json());

app.use('/albums', albumRoutes);
app.use(userRoutes);

app.listen(port, () => console.log(`Server Started on port ${port}`));
