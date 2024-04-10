const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_DATA_URL = `https://api.spacexdata.com/v4/launches/query`;

const launch = {
  flightNumber: DEFAULT_FLIGHT_NUMBER, // flight_name
  mission: 'Kepler Exploration X', // name
  rocket: 'Explorer IS1', // rocket.name
  launchDate: new Date('December 27, 2030'), // date_local
  target: 'Kepler-442 b', // not applicable
  customer: ['ZTM', 'NASA'], // payload.customers for each payload
  upcoming: true, // upcoming
  success: true // success
};

(async () => {
  await saveLaunch(launch);
})();

async function saveLaunch(launch) {
  try {
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
      }, 
      launch, 
      { 
        upsert: true
      }
    );
  } catch(err) {
    console.error(`Couldn't save/update launch! ${err.message}`)
  }
}

async function getLatestFlightNumber() {
 const latestLaunch = await launches
  .findOne()
  .sort('-flightNumber');
  
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  } 

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, {'_id': 0, '__v': 0})
    .sort({
      flightNumber: 1
    })
    .skip(skip)
    .limit(limit);
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId
  });
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    throw new Error('No matching planet was found!')
  }

  const flightNumber = await getLatestFlightNumber() + 1;
  
  const newLaunch = {
    ...launch,
    launchDate: new Date(launch.launchDate),
    success: true,
    upcoming: true,
    customer: ['Zero to Mastery', 'NASA'],
    flightNumber
  }

  await saveLaunch(newLaunch);
  
  return newLaunch;
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount === 1;
}

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_DATA_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  });

  if (response.status !== 200) {
    console.error('Problem downloading launches data');
    throw new Error('Launches data download failed');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      launchDate: launchDoc['date_local'],
      customers
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'  
  });

  if (firstLaunch) {
    console.log('Launch data already loaded');
  } else {
    populateLaunches();
  }
}

module.exports = {
  findLaunch,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  loadLaunchData
}