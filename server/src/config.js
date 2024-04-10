require('dotenv').config();

const config = {
  SERVER_PORT: process.env.SERVER_PORT || 8000,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST
};

module.exports = config;