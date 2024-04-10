const mongoose = require('mongoose');

const launchesSquema = new mongoose.Schema({
  flightNumber: { 
    type: Number, 
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  rocket: {
    type: String,
    required: true
  },
  launchDate: {
    type: Date,
    required: true
  },
  // target: { type: mongoose.ObjectId, ref: 'Planes' },
  target: {
    type: String,
  },
  customer: [ String ],
  upcoming: {
    type: Boolean,
    required: true
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  }
});

module.exports = mongoose.model('Launch', launchesSquema);