const { 
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  existsLaunchWithId
} = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  
  return res.status(201).json(await scheduleNewLaunch(launch));
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const launchWithId  = await existsLaunchWithId(launchId);
  
  if (!launchWithId) {
    return res.status(404).json({
      error: 'Launch not found'
    })
  }

  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: 'launch not aborted'
    })
  }
  
  return res.status(200).json({
    ok: true
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
};