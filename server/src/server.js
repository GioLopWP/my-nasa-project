const http = require('node:http');
const mongoose = require('mongoose');

const { SERVER_PORT } = require('./config');
const { loadPlanetsData } = require('./models/planets.model');
const { mongoConnect } = require('./services/mongo');
const { loadLaunchData } = require('./models/launches.model');

const app = require('./app');

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  
  server.listen(SERVER_PORT, () => {
    console.log(`Server listeing on port: ${SERVER_PORT}...`);
  });
} 

startServer();

