const mongoose = require('mongoose');
const env = require('./env');

const DATABASE_URL = `mongodb+srv://tim:${env.DB_PASSWORD}@my-favorites-hgcud.mongodb.net/test?retryWrites=true&w=majority`;

const connect = () => {
  mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  const db = mongoose.connection;
  db.on('error', error => console.error(error));
  db.once('open', () => console.log('Connected to database'));
};

module.exports = { connect };
