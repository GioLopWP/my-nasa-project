function validateNewLaunch(req, res, next) {
  const launch = req.body
  
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({
      error: 'Missing required launch property'
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date'
    })
  }

  next();
}

module.exports = {
  validateNewLaunch
};