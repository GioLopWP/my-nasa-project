const mongoose = require('mongoose');

const { 
  DB_USER,
  DB_PASSWORD, 
  DB_HOST
} = require('../config');

const MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?authMechanism=DEFAULT`;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    dbName: 'nasa'
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
};