const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');
const { validateNewLaunch } = require('../../validators/launches.validator');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', validateNewLaunch, httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;